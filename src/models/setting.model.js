const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema({
    key: String,
    value: Object
});

const Setting = mongoose.model('Setting', SettingSchema);

module.exports = Setting;