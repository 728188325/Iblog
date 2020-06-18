var express = require('express');
var router = express.Router();

// 登录页中间件：显示网页登录信息
function loginFlash(req, res, next) {
  res.locals.flash_success = req.flash('flash_success');
  res.locals.flash_fail = req.flash('flash_fail');
  next();
}

/* 主页（博文列表） */
router.get('/', function(req, res, next) {
    res.render('index', { userInfo: req.session.userInfo });
});

/* 登录页 */
router.get('/login',loginFlash,function(req, res, next) {
    res.render('login');
});


/* 留言板管理页 */
router.get('/word',function(req,res,next){
    res.render('word', { userInfo: req.session.userInfo });
})

module.exports = router;
