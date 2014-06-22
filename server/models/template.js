var $mongoose = require('mongoose'),
    Schema = $mongoose.Schema;

var TemplateSchema = new Schema({
    name: {
        type: String,
        default: '',
        trim: true,
        required: true
    }
});

var textModel = require('../plugins/textModel');
TemplateSchema.plugin(textModel);

var simpleTree = require('../plugins/simpleTree');
TemplateSchema.plugin(simpleTree, 'Template');

var Template;
module.exports = Template = $mongoose.model('Template', TemplateSchema);
