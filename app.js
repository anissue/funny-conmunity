

var config  = require('./config');

var express = require('express');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Loader  = require('loader');
var path    = require('path');
var ejs     = require('ejs');


var app     = express();
var userMiddlewares = require('./middlewares/auth');
var webRouter = require('./web_router');
var apiRouter = require('./api_router');

var staticDir = path.join(__dirname, 'public');
var avatarDir = path.join(__dirname, 'avatar');
var viewsDir  = path.join(__dirname, 'views');
var pictureDir = path.join(__dirname, 'picture');


app.set('views', viewsDir);
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);


app.use('/avatar', express.static(avatarDir));
app.use('/public', express.static(staticDir));
app.use('/picture', express.static(pictureDir));

app.use(session({
	secret: config.session_secret,
	store: new mongoStore({url: config.db}),
	cookie:{
		path: '/',
		domain: config.domain,
		maxAge: 1000 * 60 * 60 * 24 * 30,
		signed: true,
		httpOnly: true
	},
	resave: false,
	saveUninitialized: false
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(config.session_secret));

var assets = {};
if (config.mini_assets) {
	try {
		assets = require('./assets');
	} catch (e) {
		console.log('开启静态资源压缩前需要使用构建脚本压缩资源 http://doxmate.cool/JacksonTian/loader/index.html#index_构建');
		throw e;
	}
}

app.locals = {
	Loader: Loader,
	assets: assets,
	config: config
};

app.use('/api', apiRouter);
app.use('/', userMiddlewares.authUser);


app.use('/', webRouter);
app.use(function (err, req, res, next) {
	res.redirect('/');
});

app.listen(3000, '127.0.0.1');