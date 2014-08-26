var $mongoose = require('mongoose'),
    extend = require('mongoose-schema-extend'),
    Model = require('./_model')
    jade = require('jade');

var BlockSchema = Model.schema.extend({
    name: {
        type: String,
        default: '',
        trim: true,
        required: true
    },
}, {
    collection: 'blocks'
});

var textModel = require('../plugins/textModel');
BlockSchema.plugin(textModel);

BlockSchema.methods.compile = function(data, callback) {

	if (this.text) {
		var template = jade.compile(this.text);
		var html = template(data);
		callback(null, html);
	} else {
		callback(null,'');
	}

};

var Block;
module.exports = Block = $mongoose.model('Block', BlockSchema);