'use strict';
var mongoose = require('mongoose'),
    _ = require('lodash'),
    async = require('async'),
    fs = require('fs'),
    path = require('path');

var inputFormatsPath = path.join(__dirname, '..', 'plugins', 'output-formats');
var regex = {
    global: /\{{2}=([a-zA-Z0-9_\$-]+)\}{2}([\W\w]+)\{{2}\1=\}{2}/g,
    single: /\{{2}=([a-zA-Z0-9_\$-]+)\}{2}([\W\w]+)\{{2}\1=\}{2}/
};

function extractPropertyTags(template) {

    var parsed = template.match(/\{\{[^(+|=|~)][^}]*[^(=|+|~)]\}\}/g) || [];

    parsed = parsed
        .map(function(tag) {
            return tag.replace(/(^\{\{)|(\}\}$)/g, '');
        })
        .map(function(tag) {

            if (!tag) {
                return null;
            }

            var outputConfig = tag.split(':');

            if (outputConfig.length === 1) {
                outputConfig.push('text');
            } else if (outputConfig.length === 0) {
                return null;
            }

            var property = outputConfig[0];

            var format = outputConfig[1];

            var options = outputConfig.splice(2);

            outputConfig = {
                property: property,
                format: format,
                options: options,
                raw: ['{{', tag, '}}'].join('')
            };

            return outputConfig;
        })
        .filter(function(tag) {
            return tag !== null;
        });


    return parsed;

}

function extractScriptTags(template) {

    var parsed = template.match(/\{{2}~[^\{.]*\}{2}/g) || [];

    parsed = parsed
        .map(function(tag) {
            return tag.replace(/(^\{{2}~)|(\}{2}|$)/g, '');
        })
        .map(function(tag) {
            if (!tag) {
                return null;
            }

            var outputConfig = tag.split(':');

            if (outputConfig.length === 0) {
                return null;
            }

            var options = outputConfig.splice(1);

            var name = tag;
            if (options.length) {
                name = name.replace(':' + options, '');


                options = options.shift().split(',');

                var mapped = options.map(function(part) {
                    var parts1 = part.split('=');
                    var option = {
                        name: parts1[0],
                        value: true
                    };
                    if (parts1[1]) {
                        option.value = parts1[1];
                    }

                    return option;
                });

                options = {};
                _.forEach(mapped, function(item) {
                    options[item.name] = item.value;
                });
            }

            outputConfig = {
                name: name,
                options: options,
                raw: ['{{~', tag, '}}'].join('')
            };

            return outputConfig;
        })
        .filter(function(tag) {
            return tag !== null;
        });




    return parsed;

}

function linkProperties(template, content, callback) {

    var tags = extractPropertyTags(template);

    var Setting = mongoose.model('Setting');




    function getSettings(forwardSettings) {
        var siteSettings = [];

        Setting.find({}).exec(function(err, settings) {
            if (err) {
                return forwardSettings(err);
            }

            _.forEach(settings, function(setting) {
                siteSettings.push({
                    name: '$' + setting.alias,
                    value: setting.value
                });
            });

            return forwardSettings(null, siteSettings);
        });

    }

    function link(siteSettings, doneLinking) {

        content.properties = content.properties.concat([{
            name: '$name',
            value: content.name
        }, {
            name: '$created',
            value: content.created
        }, {
            name: '$modified',
            value: content.modified
        }]).concat(siteSettings);

        var properties = content.properties;

        var tagOutput = _.map(tags, function(tag) {

            var property = _.find(properties, {
                name: tag.property
            });

            if (!property) {
                return null;
            }

            var modulePath = path.join(inputFormatsPath, tag.format + '.js');
            modulePath = path.resolve(modulePath);

            if (fs.existsSync(modulePath)) {
                var outputFormatModule = require(modulePath);

                var output = outputFormatModule.print(property, tag.options);

                tag.output = output;
                return tag;
            } else {

                console.log(modulePath);
            }

        }).filter(function(tag) {
            return tag !== null && tag !== undefined;
        });

        var compiledTemplate = template;

        _.forEach(tagOutput, function(tag) {

            compiledTemplate = compiledTemplate.replace(tag.raw, tag.output);

        });

        return doneLinking(null, compiledTemplate);
    }


    async.waterfall([getSettings, link], function(err, template) {
        callback(null, template);
    });


}


function linkScripts(template, content, callback) {

    var tags = extractScriptTags(template, content);

    var Script = mongoose.model('Script');
    async.map(tags, function(tag, mapNextTag) {

        Script.findOne({
            name: tag.name
        }).exec(function(err, script) {
            if (err) {
                mapNextTag(err);
            } else if (!script) {
                mapNextTag();
            } else {
                script.tag = tag;
                script.execute(content, mapNextTag);
            }
        });

    }, function(err, results) {
        results = results.filter(function(tag) {
            return tag !== null && tag !== undefined;
        });

        _.forEach(results, function(tag) {
            console.log(tag);
            template = template.replace(tag.raw, tag.content || '');

        });

        callback(null, template);
    });

}

function compileTemplate(template) {

    // console.log(template);

    // if () {} // for example if the template is in another format like jade

    try {

        var jade = require('jade');

        var templateFunction = jade.compile(template);

        template = templateFunction({});

        return function(content, callback) {

            linkProperties(template, content, function(err, compiledTemplate) {

                linkScripts(compiledTemplate, content, callback);

            });

        };

    } catch(error) {

        return error;
        
    }

}

function getTemplate(content, req, res) {
    var ContentType = mongoose.model('ContentType');
    var Template = mongoose.model('Template');
    content.getPath(function(err, path) {
        content.path = path;

        ContentType.populate(content.type, {
            path: 'template'
        }, function(err, contentType) {

            if (err) {

                res.send(400, err);

            } else if (!contentType) {

                res.send(404, 'A type must be specified for all items');

            } else {
                var template = new Template(contentType.template);

                template.getTreeStack(function(err, stack) {

                    function processMatch(match) {
                        var parts = match.match(regex.single);
                        // console.log(parts);
                        var block = {
                            placeholder: parts[1],
                            block: (parts[3] || parts[2]).trim(),
                            raw: parts[0]
                        };

                        if (parts[3]) {
                            var options = parts[2];
                            parts = options.split(',').map(function(i) {
                                return i.trim();
                            }).filter(function(i) {
                                return i.trim();
                            });
                            block.options = {};
                            parts.map(function(i) {
                                var keyval = i.split('=');
                                var option = {
                                    key: keyval[0],
                                    value: keyval[1] || true
                                };
                                return option;
                            }).forEach(function(i) {
                                block.options[i.key] = i.value;
                            });
                        }

                        return block;
                    }

                    function findBlocks(stack, accumulator, callback) {

                        var currentNode = stack.shift();


                        if (accumulator) {
                            var keys = _.keys(accumulator);
                            keys.forEach(function(key) {
                                var regex = '{{+' + key + '}}';
                                currentNode.text = currentNode.text.replace(regex, accumulator[key]);
                            });
                        } else {
                            accumulator = {};
                        }

                        if (currentNode.parent) {

                            currentNode.text.match(regex.global)
                                .map(function(match) {

                                    var block = processMatch(match);
                                    // console.log(block);
                                    return block;
                                }).forEach(function(block) {
                                    accumulator[block.placeholder] = block.block;
                                });

                            findBlocks(stack, accumulator, callback);

                        } else {
                            // console.log(currentNode);
                            callback(null, currentNode.text);
                        }

                    }

                    if (stack && stack.length) {

                        findBlocks(stack, null, function(err, text) {
                            var compiler = compileTemplate(text);

                            if (!_.isFunction(compiler)) {
                                return res.render('404');
                            }

                            compiler(content, function(err, html) {
                                res.send(200, html);
                            });
                        });

                    } else {
                        res.send(400);
                    }


                });

            }




        });
    });
}

function getTemplateById(req, res) {

    var contentId = req.params.contentId;

    var Content = mongoose.model('Content');

    var contentQuery = Content.findById(contentId);

    contentQuery.populate('type');

    contentQuery.exec(function(err, content) {

        getTemplate(content, req, res);

    });

}

function getTemplateByPath(req, res) {

    var contentPath = req.url;


    var Content = mongoose.model('Content');

    Content.findByPath(contentPath, function(err, contentId) {

        if (err) {
            res.send(404, 'Not Found');
        } else {
            req.params.contentId = contentId;
            getTemplateById(req, res);
        }

    });

}




module.exports = {
    viewById: getTemplateById,
    viewByPath: getTemplateByPath
};
