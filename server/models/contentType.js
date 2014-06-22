var $mongoose = require('mongoose'),
    extend = require('mongoose-schema-extend'),
    ContentTypeProperty = require('./contentTypeProperty'),
    Model = require('./_model');

var ContentTypeSchema = Model.schema.extend({
    name: {
        type: String,
        default: '',
        trim: true,
        required: true
    },
    template: {
        ref: 'Template',
        type: $mongoose.Schema.Types.ObjectId
    },
    properties: [ContentTypeProperty]
}, {
    collection: 'contenttypes'
});

var simpleTree = require('../plugins/simpleTree');
ContentTypeSchema.plugin(simpleTree, 'ContentType');

var ContentType;
module.exports = ContentType = $mongoose.model('ContentType', ContentTypeSchema);