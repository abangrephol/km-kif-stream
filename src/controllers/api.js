const redisClient = require('../redis-client');
const Setting = require('../models/setting.model')
const winston = require('winston');

exports.setLive = async (req, res) => {
    const {isLive} = req.params;

    try {
        const setting = await Setting.findOneAndReplace({key: 'isLive'}, {
            key: 'isLive',
            value: isLive
        }, {new: true, upsert: true})
            .exec();

        res.send({status: true, data: setting});
    } catch (e) {
        winston.error(e.message);
        res.send({status: false, message: e.message})
    }
}
exports.setStatic = async (req, res) => {
    const {isStatic} = req.params;

    try {
        const setting = await Setting.findOneAndReplace({key: 'isStatic'}, {
            key: 'isStatic',
            value: isStatic
        }, {new: true, upsert: true})
            .exec();

        res.send({status: true, data: setting});
    } catch (e) {
        winston.error(e.message);
        res.send({status: false, message: e.message})
    }
}
exports.setVideoStatic = async (req, res) => {
    const {videoStatic} = req.params;

    try {
        const setting = await Setting.findOneAndReplace({key: 'videoStatic'}, {
            key: 'videoStatic',
            value: videoStatic
        }, {new: true, upsert: true})
            .exec();

        res.send({status: true, data: setting});
    } catch (e) {
        winston.error(e.message);
        res.send({status: false, message: e.message})
    }
}

exports.setSettings = async (req, res, next) => {
    try {
        let {isLive, isStatic} = req.body;
        const videoStatic = req.file;
        isLive = isLive === undefined ? 0 : isLive;
        isStatic = isStatic === undefined ? 0 : isStatic;

        const settingIsLive = await Setting.findOneAndReplace({key: 'isLive'}, {
            key: 'isLive',
            value: isLive
        }, {new: true, upsert: true})
            .exec();

        const settingIsStatic = await Setting.findOneAndReplace({key: 'isStatic'}, {
            key: 'isStatic',
            value: isStatic
        }, {new: true, upsert: true})
            .exec();

        if (videoStatic !== undefined) {
            const setting = await Setting.findOneAndReplace({key: 'videoStatic'}, {
                key: 'videoStatic',
                value: videoStatic.filename
            }, {new: true, upsert: true})
                .exec();
        }

        res.redirect('/stream-admin');
    } catch (e) {
        winston.error(e.message)
        throw new Error(e)
    }
}

module.exports = exports;