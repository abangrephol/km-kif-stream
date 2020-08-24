const path = require('path');
const express = require('express');
const app = express();
const winston = require('winston');
const mongoose = require('mongoose');
const Setting = require('./models/setting.model');
const ChatUser = require('./models/chat-user.model');
const Chat = require('./models/chat.model');
const PrizeModel = require('./models/prize.model');
var bodyParser = require('body-parser');

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
app.enable('trust proxy');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);

app.use(express.static(path.resolve(__dirname, '../public')));

app.get('/', async (req, res) => {
    try {
        const isLiveSetting = await Setting.findOne({key: 'isLive'}).exec();
        let isLive = isLiveSetting ? isLiveSetting.value : false;
        const liveChatSetting = await Setting.findOne({key: 'liveChat'}).exec();
        let liveChat = liveChatSetting ? liveChatSetting.value : false;
        const isStaticSetting = await Setting.findOne({key: 'isStatic'}).exec();
        let isStatic = isStaticSetting ? isStaticSetting.value : false;
        const videoStaticSetting = await Setting.findOne({key: 'videoStatic'}).exec();
        let videoStatic = videoStaticSetting ? videoStaticSetting.value : null;
        const streamHost = req.protocol + '://' + req.headers.host;
        let liveStreamObj = {
            layout: 'pages/layout',
            liveChat,
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
app.get('/video', async function(req, res) {
    const isLiveSetting = await Setting.findOne({key: 'isLive'}).exec();
    let isLive = isLiveSetting ? isLiveSetting.value : false;
    const isStaticSetting = await Setting.findOne({key: 'isStatic'}).exec();
    let isStatic = isStaticSetting ? isStaticSetting.value : false;
    const videoStaticSetting = await Setting.findOne({key: 'videoStatic'}).exec();
    let videoStatic = videoStaticSetting ? videoStaticSetting.value : null;
    const streamHost = req.protocol + '://' + req.headers.host;
    let liveStreamObj = {
        layout: 'pages/layout',
        isLive,
        isStatic,
        videoStatic,
        streamHost
    };
    res.render('pages/video', liveStreamObj);
});
app.get('/prize', async function(req, res) {
    const streamHost = req.protocol + '://' + req.headers.host;
    const prizeWinner = await PrizeModel.find({
        winPrize : true
    }).exec()

    let liveStreamObj = {
        layout: 'prize/layout',
        streamHost,
        prizeWinner
    };
    res.render('prize/index', liveStreamObj);
})

app.get('/stream-admin', async (req, res)  => {
    try {
        const isLiveSetting = await Setting.findOne({key: 'isLive'}).exec();
        let isLive = isLiveSetting ? isLiveSetting.value : false;
        const liveChatSetting = await Setting.findOne({key: 'liveChat'}).exec();
        let liveChat = liveChatSetting ? liveChatSetting.value : false;
        const isStaticSetting = await Setting.findOne({key: 'isStatic'}).exec();
        let isStatic = isStaticSetting ? isStaticSetting.value : false;
        const videoStaticSetting = await Setting.findOne({key: 'videoStatic'}).exec();
        let videoStatic = videoStaticSetting ? videoStaticSetting.value : null;
        const prizeMaxSetting = await Setting.findOne({key: 'prizeMax'}).exec();
        let prizeMax = prizeMaxSetting ? prizeMaxSetting.value : null;
        const streamHost = req.protocol + '://' + req.headers.host;

        const chatUserList = await ChatUser.find().exec();

        const prizeList = await PrizeModel.find()
            .sort({'winPrize': 'desc'})
            .sort({'perusahaan': 'asc'})
            .exec();

        let adminObj = {
            layout: 'admin/layout',
            liveChat,
            isLive,
            isStatic,
            videoStatic,
            streamHost,
            chatUserList,
            prizeList,
            prizeMax
        };
        res.render('admin/index', adminObj)
    } catch (e) {
        winston.error(e.message);
    }
})

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api', apiRoute);

const server = app.listen(8080);
console.log('8080 is the magic port');

let numUsers = 0;

const io = require('socket.io').listen(server);
io.on('connection', (socket) => {
    var addedUser = false;

    // when the client emits 'new message', this listens and executes
    socket.on('new message', async (data) => {
        // we tell the client to execute 'new message'
        const chat = new Chat({
            user: socket.userId,
            message: data
        })

        await chat.save();
        socket.broadcast.emit('new message', {
            username: socket.username,
            message: data
        });
    });

    // when the client emits 'add user', this listens and executes
    socket.on('add user', async (username) => {
        if (addedUser) return;

        // we store the username in the socket session for this client
        socket.username = username;
        const user = await ChatUser.findOneAndReplace({name: username}, {
            name: username
        }, {new: true, upsert: true})
            .exec();
        socket.userId = user.id;

        ++numUsers;
        addedUser = true;
        socket.emit('login', {
            numUsers: numUsers,
            user
        });
        // echo globally (all clients) that a person has connected
        socket.broadcast.emit('user joined', {
            username: socket.username,
            numUsers: numUsers
        });
    });

    // when the client emits 'typing', we broadcast it to others
    socket.on('typing', () => {
        socket.broadcast.emit('typing', {
            username: socket.username
        });
    });

    // when the client emits 'stop typing', we broadcast it to others
    socket.on('stop typing', () => {
        socket.broadcast.emit('stop typing', {
            username: socket.username
        });
    });

    // when the user disconnects.. perform this
    socket.on('disconnect', () => {
        if (addedUser) {
            --numUsers;

            // echo globally that this client has left
            socket.broadcast.emit('user left', {
                username: socket.username,
                numUsers: numUsers
            });
        }
    });
});