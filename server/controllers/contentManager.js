'use strict';
var mongoose = require('mongoose'),
    _ = require('lodash'),
    async = require('async'),
    mustache = require('mustache'),
    fs = require('fs'),
    path = require('path');

var inputFormatsPath = path.join(__dirname, '..', 'plugins', 'output-formats');
var regex = {
    global: /\{{2}=([a-zA-Z0-9_\$-]+)\}{2}([\W\w]+)\{{2}\1=\}{2}/g,
    single: /\{{2}=([a-zA-Z0-9_\$-]+)\}{2}([\W\w]+)\{{2}\1=\}{2}/
};

function parseTags(template) {

    var parsed = template.match(/\{\{[^(+|=)][^}]*[^(=|+)]\}\}/g) || [];

    console.log(parsed);

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

function compileTemplate(template) {

    console.log(template);
    var tags = parseTags(template);

    return function(content) {

        var siteSettings = [{
            name: '$site-title',
            value: 'Node ToastyCMS'
        }];

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
                console.log(tag);
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

        return compiledTemplate;

    };

};


var ViewPage = function(req, res) {

    var contentId = req.params.contentId;

    var Content = mongoose.model('Content');
    var ContentType = mongoose.model('ContentType');

    var contentQuery = Content.findById(contentId);

    contentQuery.populate('type');

    contentQuery.exec(function(err, content) {

        ContentType.populate(content.type, {
            path: 'template'
        }, function(contentType) {


            var html = compileTemplate(content.type.template.text)(content);

            res.send(200, html);


        });

    });

};

function GetTemplate(req, res) {

    var contentId = req.params.contentId;

    var Content = mongoose.model('Content');
    var ContentType = mongoose.model('ContentType');
    var Template = mongoose.model('Template');

    var contentQuery = Content.findById(contentId);

    contentQuery.populate('type');

    contentQuery.exec(function(err, content) {

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
                        console.log(parts);
                        var block = {
                            placeholder: parts[1],
                            block: (parts[3] || parts[2]).trim(),
                            raw: parts[0]
                        };

                        if (parts[3]) {
                            var options = parts[2];
                            var parts = options.split(',').map(function(i) {
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

                            var matches = currentNode.text.match(regex.global)
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
                            var html = compileTemplate(text)(content);
                            res.send(200, html);
                        });

                    } else {
                        res.send(400);
                    }


                });

            }




        });

    });

}



module.exports = {
    view: GetTemplate
};
