const Setting = require('../models/setting.model')
const winston = require('winston');
const ChatUser = require('../models/chat-user.model');
const PrizeModel = require('../models/prize.model');
const readXlsxFile = require('read-excel-file/node');

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
        let {isLive, isStatic, liveChat, prizeMax} = req.body;
        const videoStatic = req.file;
        isLive = isLive === undefined ? 0 : isLive;
        liveChat = liveChat === undefined ? 0 : liveChat;
        isStatic = isStatic === undefined ? 0 : isStatic;
        prizeMax = isStatic === undefined ? 0 : prizeMax;

        const settingIsLive = await Setting.findOneAndReplace({key: 'isLive'}, {
            key: 'isLive',
            value: isLive
        }, {new: true, upsert: true})
            .exec();

        const settingliveChat = await Setting.findOneAndReplace({key: 'liveChat'}, {
            key: 'liveChat',
            value: liveChat
        }, {new: true, upsert: true})
            .exec();

        const settingIsStatic = await Setting.findOneAndReplace({key: 'isStatic'}, {
            key: 'isStatic',
            value: isStatic
        }, {new: true, upsert: true})
            .exec();

        const settingPrizeMax = await Setting.findOneAndReplace({key: 'prizeMax'}, {
            key: 'prizeMax',
            value: prizeMax
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

exports.prizeList = async (req, res) => {
    try {
        const prizeAll = await PrizeModel.find()
            .sort({'winPrize': 'desc'})
            .sort({'perusahaan': 'asc'})
            .exec();

        const prizeWinner = await PrizeModel.find({
            winPrize : true
        }).exec()

        const prizePerusahaanWinner = await PrizeModel.find({
            winPrize : true
        })
            .select('perusahaan -_id')
            .distinct('perusahaan')
            .exec()

        const prizeList = await PrizeModel.find({
            winPrize: false,
            perusahaan : { "$nin": prizePerusahaanWinner  }
        })
            .sort({'winPrize': 'desc'})
            .sort({'perusahaan': 'asc'})
            .exec();

        res.send({
            prizeAll,
            prizeList,
            prizeWinner,
            status: true
        });
    } catch (e) {
        res.send({status: false, message: e.message});
    }
}

exports.prizePurgeWinner = async (req, res) => {
    try {
        await PrizeModel.updateMany({
            winPrize : true
        }, {
            winPrize : false
        })
        res.send({status: true});
    } catch (e) {
        res.send({status: false});
    }
}

exports.prizeXlsUpload = async (req, res) => {
    const upload = req.file;
    await readXlsxFile(upload.path).then(async (rows) => {
        await PrizeModel.deleteMany({});
        let prizes = [];
        rows.forEach((v) => {
            if (v[0] !== "PERUSAHAAN") {
                prizes.push({
                    perusahaan: v[0],
                    kategori: v[1],
                    nama: v[2],
                    nik: v[3],
                    winPrize: false
                })
            }
        })

        if (prizes.length > 0) {
            await PrizeModel.insertMany(
                prizes
            );
        }
    })

    res.redirect('/stream-admin');
}

exports.prizeWin = async (req, res) => {
    let {userId, win} = req.params;

    try {
        const user = await PrizeModel.findByIdAndUpdate(
            userId, {
                winPrize: win
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