var $mongoose = require('mongoose'),
    extend = require('mongoose-schema-extend'),
    Model = require('./_model');

var FileSystemItemSchema = Model.schema.extend({
    name: {
        type: String,
        default: '',
        trim: true,
        required: true
    }
}, {
    collection: 'filesystemitems'
});

FileSystemItemSchema.pre('save', function(done) {
    var fsItem = this;

    var conditions = {
        name: fsItem.name
    };

    if (fsItem.parent) {
        conditions.parent = fsItem.parent;
    }

    var FileSystemItem = $mongoose.model('FileSystemItem');
    FileSystemItem
        .count(conditions).exec(
            function(err, count) {
                console.log('model::filesystemitem::handleFileUpload::findOneAndUpdate::enter');
                if (err) {
                    console.log('model::filesystemitem::handleFileUpload::findOneAndUpdate::error', (err.message || err));
                    return done(err);
                }

                if (count > 0) {
                    err = new Error('A file system item with this name already exists');
                    console.log('model::filesystemitem::handleFileUpload::findOneAndUpdate::err', err.message);
                    return done(err);
                }

                console.log('model::filesystemitem::handleFileUpload::findOneAndUpdate::success');
                done();
            });
});

var nestableModel = require('../plugins/nestableModel');
FileSystemItemSchema.plugin(nestableModel, 'FileSystemItem');

var FileSystemItem = $mongoose.model('FileSystemItem', FileSystemItemSchema);
module.exports = FileSystemItem;
