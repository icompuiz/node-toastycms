var $mongoose = require('mongoose'),
    extend = require('mongoose-schema-extend'),
    ContentProperty = require('./contentProperty'),
    Model = require('./_model');

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
    properties: [ContentProperty]
}, {
    collection: 'contentitems'
});

var simpleTree = require('../plugins/simpleTree');
ContentSchema.plugin(simpleTree, 'Content');

var Content;
module.exports = Content = $mongoose.model('Content', ContentSchema);