const redisClient = require('../redis-client');

exports.setLive = async (req, res) => {
    const {isLive} = req.params;
    await redisClient.setAsync('isLive', isLive);
    res.send('ok');
}

module.exports = exports;