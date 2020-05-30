var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

import session from 'express-session'
import flash from 'connect-flash'
import moment from 'moment'

//数据库连接
import './config/db'
//创建超级管理员
import './config/createManager'

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
import articlesRouter from './routes/articles'
import wordsRouter from './routes/words'


var app = express();


//ejs渲染moment
app.locals.moment = moment;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// session配置
app.use(session({
  secret: 'iblog',
  name: 'name',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000*60*30
  }
}))
app.use(flash());

// 访问网站/根路径判断是否登录，登录直接跳转到管理平台
app.get("/",function(req,res,next){
  if(!req.session.userInfo){
    return res.redirect('/admin/login');
  }else{
    return res.redirect('/admin');
  }
})
// 监听get请求，判断是否需要验证登录
app.get("*",function(req,res,next){
  //配置跨域
  if(req.path!="/admin/login"){
    // console.log("需要验证是否登录");
    if(!req.session.userInfo){
      return res.redirect('/admin/login');
    }
  }
  next();
})

app.use('/admin', indexRouter);
app.use('/admin/users', usersRouter);
app.use('/admin/articles',articlesRouter);
app.use('/admin/words',wordsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;