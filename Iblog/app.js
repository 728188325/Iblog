var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

import compression from 'compression'

//数据库连接
import './config/db'
//创建站点信息
import './config/createWebsiteInfo'

import articlesRouter from './routes/articles'
import wordsRouter from './routes/words'
//app端的接口
import appApiRouter from './routes/appApi'

import moment from 'moment'

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

//ejs渲染moment
app.locals.moment = moment;

//使用压缩功能
app.use(compression());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 自定义跨域中间件
var allowCors = function(req, res, next) {
	res.header('Access-Control-Allow-Origin', req.headers.origin);
	res.header('Access-Control-Allow-Methods', '*');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	res.header('Access-Control-Allow-Credentials','true');
	next();
};
//app.use(allowCors);//使用跨域中间件


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/articles',articlesRouter);
app.use('/words',wordsRouter);
app.use('/appApi',appApiRouter);

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

module.exports = app;
