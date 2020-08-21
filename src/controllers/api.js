const Setting = require('../models/setting.model')
const winston = require('winston');
const ChatUser = require('../models/chat-user.model');

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

exports.chatUserAllow = async (req, res) => {
    let {userId, allowed} = req.body;

    try {
        const user = await ChatUser.findByIdAndUpdate(userId, {
            allowPrize: allowed
        }, {new: true})
            .exec();
        res.send({user, status: true});
    } catch (e) {
        res.send({status: false, message: e.message});
    }
}

exports.chatUserDelete = async (req, res) => {
    let {userId} = req.body;

    try {
        const user = await ChatUser.findByIdAndDelete(
            userId
        ).exec();
        res.send({user, status: true});
    } catch (e) {
        res.send({status: false, message: e.message});
    }
}

exports.chatUserWin = async (req, res) => {
    let {userId} = req.params;

    try {
        const user = await ChatUser.findByIdAndUpdate(
            userId, {
                winPrize: true,
                allowPrize: true
            }, {
                new: true
            }
        ).exec();
        res.send({user, status: true});
    } catch (e) {
        res.send({status: false, message: e.message});
    }
}

module.exports = exports;