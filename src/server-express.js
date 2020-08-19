const redis = require('redis');
const path = require('path');
const express = require('express');
const app = express();
const redisClient = require('./redis-client');
const winston = require('winston');
const mongoose = require('mongoose');
const Setting = require('./models/setting.model');

mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise;

mongoose.connection.on('connected', () => {
    winston.info('Mongoose connected!');
});

mongoose.connection.on('disconnected', () => {
    winston.info('Mongoose disconnected!');
});

mongoose.connection.on('error', (err) => {
    winston.error(err.message);
    process.exit(1);
});

const apiRoute = require('./routes/api')
const router = express.Router();
const os = require("os");

const expressLayouts = require('express-ejs-layouts');

app.set('trust proxy', true);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);

app.use(express.static(path.resolve(__dirname, '../public')));

app.get('/', async (req, res) => {
    try {
        const isLiveSetting = await Setting.findOne({key: 'isLive'}).exec();
        let isLive = isLiveSetting ? isLiveSetting.value : false;
        const isStaticSetting = await Setting.findOne({key: 'isStatic'}).exec();
        let isStatic = isStaticSetting ? isStaticSetting.value : false;
        const videoStaticSetting = await Setting.findOne({key: 'videoStatic'}).exec();
        let videoStatic = videoStaticSetting ? videoStaticSetting.value : null;
        const streamHost = req.headers.host;
        let liveStreamObj = {
            layout: 'pages/layout',
            isLive,
            isStatic,
            videoStatic,
            streamHost
        };
        res.render('pages/index', liveStreamObj);
    } catch (e) {
        winston.error(e.message);
    }
});
app.get('/video', function(req, res) {
    res.render('pages/video');
});

app.get('/stream-admin', async (req, res)  => {
    try {
        const isLiveSetting = await Setting.findOne({key: 'isLive'}).exec();
        let isLive = isLiveSetting ? isLiveSetting.value : false;
        const isStaticSetting = await Setting.findOne({key: 'isStatic'}).exec();
        let isStatic = isStaticSetting ? isStaticSetting.value : false;
        const videoStaticSetting = await Setting.findOne({key: 'videoStatic'}).exec();
        let videoStatic = videoStaticSetting ? videoStaticSetting.value : null;
        const streamHost = req.headers.host;
        let adminObj = {
            layout: 'admin/layout',
            isLive,
            isStatic,
            videoStatic,
            streamHost
        };
        res.render('admin/index', adminObj)
    } catch (e) {
        winston.error(e.message);
    }
})

app.use('/api', apiRoute);

app.listen(8080);
console.log('8080 is the magic port');