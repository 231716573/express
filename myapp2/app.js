var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var multer = require('multer');
var session = require('express-session')
var MongoStore = require('connect-mongo')(session);
var setting = require('./setting');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var adminRouter = require('./routes/admin');
var adminArticleRouter = require('./routes/adminArticle');
var configRouter = require('./routes/config');
var categoryRouter = require('./routes/category');

var app = express();

app.use("*", function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  if (req.method === 'OPTIONS') {
    res.send(200)
  } else {
    next()
  }
});


app.use(multer({
  dest: './public/multer',
  rename: function (fieldname, filename) {
    return filename;
  }
}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: setting.cookieSecret,
  saveUninitialized:false,
  resave: false,
  store:new MongoStore({
    url: setting.url,
    touchAfter: 24 * 3600
  })
}))

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/admin', adminRouter);
app.use('/adminArticle', adminArticleRouter);
app.use('/config', configRouter);
app.use('/category', categoryRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var debug = require('debug')('my-application'); // debug模块
app.set('port', process.env.PORT || 3000); // 设定监听端口

//启动监听
var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});

// module.exports = app;