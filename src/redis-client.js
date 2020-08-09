// redis-client.js
const redis = require('redis');
const {promisify} = require('util');
const client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);
/**
 * Redis
 */
client.on('reconnecting', () => {
    console.log('reconnecting');
});
client.on('connect', () => {
    console.log('connect');
});
client.on('error', error => {
    try {
        console.log(error);
    } catch (err) {
        console.log('error', err);
    }
});
client.on('end', () => {
    console.log('end');
});
module.exports = {
    ...client,
    getAsync: promisify(client.get).bind(client),
    setAsync: promisify(client.set).bind(client),
    keysAsync: promisify(client.keys).bind(client)
};