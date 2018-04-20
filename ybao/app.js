var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var settings = require('./settings');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
//var users = require('./routes/users');

var app = express();

var routes = require('./routes/index');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(flash());
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(settings.cookieSecret));
app.use(express.static(path.join(__dirname, 'public')));

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
app.use(session({
  secret: settings.cookieSecret, //一个String类型的字符串，作为服务器端生成session的签名。与cookieParser中的一致
  saveUninitialized:false, //在存储一些新数据之前，不创建session
  resave: false, //如果没有发生任何修改不储存session。
	store:new MongoStore({
	url:settings.url,
	//ttl: 3*24*60*60,
	touchAfter:24*3600 //单位是秒，24小时内，无论你发多少个请求，session之后被更新一次
	})
}));





routes(app);
module.exports = app;
