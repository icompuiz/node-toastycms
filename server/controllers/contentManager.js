'use strict';
var mongoose = require('mongoose'),
    _ = require('lodash'),
    async = require('async'),
    mustache = require('mustache'),
    fs = require('fs'),
    path = require('path');

var inputFormatsPath = path.join(__dirname, '..', 'plugins', 'output-formats');

function parseTags(template) {

    var parsed = template
        .match(/\{\{[^}]*}}/gi)
        .map(function(tag) {
            return tag.replace(/(^\{\{)|(}}$)/g, '');
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

function compile(template) {

    var tags = parseTags(template);

    return function(content) {

        content.properties = content.properties.concat([{
            name: '$name',
            value: content.name
        }, {
            name: '$created',
            value: content.created
        }, {
            name: '$modified',
            value: content.modified
        }]);

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


            var html = compile(content.type.template.text)(content);

            res.send(200, html);


        });

    });

};

module.exports = {
    view: ViewPage
};
