const redisClient = require('../redis-client');

exports.setLive = async (req, res) => {
    const {isLive} = req.params;
    await redisClient.setAsync('isLive', isLive);
    res.send('ok');
}
exports.setStatic = async (req, res) => {
    const {isStatic} = req.params;
    await redisClient.setAsync('isStatic', isStatic);
    res.send('ok');
}
exports.setVideoStatic = async (req, res) => {
    const {videoStatic} = req.params;
    await redisClient.setAsync('videoStatic', videoStatic);
    res.send('ok');
}

module.exports = exports;