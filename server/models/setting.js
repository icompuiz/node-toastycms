'use strict';

var $mongoose = require('mongoose'),
    Model = require('./_model'),
    _ = require('lodash');

require('mongoose-schema-extend');

var SettingSchema = Model.schema.extend({
    name: {
        type: String,
        default: '',
        trim: true,
        required: true
    },
    alias: {
        type: String,
        default: '',
        trim: true,
        required: true
    },
    value: {
        type: String,
        default: '',
        trim: true,
        required: true
    }
}, {
    collection: 'settings'
});

SettingSchema.pre('save', function(done) {
        var doc = this;

        if (_.isEmpty(doc.alias)) {
            doc.alias = doc.name.toLowerCase().replace(/\W/, '_');
        } else {
            doc.alias = doc.alias.toLowerCase().replace(/\W/, '_');
        }

        done();
    });

var Setting;
module.exports = Setting = $mongoose.model('Setting', SettingSchema);
