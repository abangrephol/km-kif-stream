const redis = require('redis');
const path = require('path');
const express = require('express');
const app = express();
const redisClient = require('./redis-client');

app.set('trust proxy', true);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.resolve(__dirname, '../public')));

app.get('/', function(req, res) {
    res.render('pages/index');
});
app.get('/video', function(req, res) {
    res.render('pages/video');
});

app.listen(8080);
console.log('8080 is the magic port');