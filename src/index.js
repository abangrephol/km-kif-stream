require('dotenv').config()

require('./server')

var path = require('path');
var express = require('express');
var app = express();
app.set('trust proxy', true);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', function(req, res) {
    res.render('pages/index');
});

app.listen(8080);
console.log('8080 is the magic port');
