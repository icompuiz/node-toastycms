'use strict';

var $mongoose = require('mongoose'),
    ContentProperty = require('./contentProperty'),
    Model = require('./_model');

require('mongoose-schema-extend');

var ContentSchema = Model.schema.extend({
    name: {
        type: String,
        default: '',
        trim: true,
        required: true
    },
    type: {
        ref: 'ContentType',
        type: $mongoose.Schema.Types.ObjectId
    },
    properties: [ContentProperty.schema]
}, {
    collection: 'contentitems'
});

var nestableModel = require('../plugins/nestableModel');
ContentSchema.plugin(nestableModel, 'Content');

var Content;
module.exports = Content = $mongoose.model('Content', ContentSchema);