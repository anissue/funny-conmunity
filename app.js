

var config  = require('./config');

var express = require('express');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var bodyParser = require('body-parser');
var path    = require('path');
var ejs     = require('ejs');


var app     = express();
var webRouter = require('./web_router');
var apiRouter = require('./api_router');
var auth      = require('./middlewares/auth');

var staticDir = path.join(__dirname, 'public');
var avatarDir = path.join(__dirname, 'avatar');
var viewsDir  = path.join(__dirname, 'views');




app.set('views', viewsDir);
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.use(session({
	secret: config.session_secret,
	store: new mongoStore({url: config.db}),
	resave: false,
	saveUninitialized: false
}));

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/avatar', express.static(avatarDir));
app.use('/public', express.static(staticDir));
app.use('/api', apiRouter);
app.use('/', auth.authUser);
app.use('/', webRouter);

// app.listen(80, '192.168.25.18');
app.listen(80, '127.0.0.1');