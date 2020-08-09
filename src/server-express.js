const redis = require('redis');
const path = require('path');
const express = require('express');
const app = express();
const redisClient = require('./redis-client');

const apiRoute = require('./routes/api')
const router = express.Router();

app.set('trust proxy', true);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.resolve(__dirname, '../public')));

app.get('/', async (req, res) => {
    let isLive = await redisClient.getAsync("isLive");
    if (isLive == null) isLive = false;
    const streamHost = process.env.STREAM_HOST;
    let liveStreamObj = {
        isLive,
        streamHost
    };
    res.render('pages/index', liveStreamObj);
});
app.get('/video', function(req, res) {
    res.render('pages/video');
});

app.use('/api', apiRoute);

app.listen(8080);
console.log('8080 is the magic port');