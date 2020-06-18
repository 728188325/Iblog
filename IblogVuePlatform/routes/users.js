var express = require('express');
var router = express.Router();
import UserModel from '../models/user'


// 登录
router.post('/login',function(req,res,next){
    UserModel.findOne({
        userName:req.body.userName,
        password:req.body.password
    },{password:0},function(err,doc){
        if(err){
            console.log("查询失败",err);
        }else{
            if(doc){
                // 登录成功
                req.session.userInfo = doc;
                //res.redirect('/admin')
                res.redirect('/')
            }else{
                // 登录失败
                req.flash('flash_fail',"登录失败，密码或账号错误~")
                res.redirect('back');
            }
        }
    })
})

//退出登录
router.get('/logout',function(req,res,next){
    req.session.userInfo = null;
    res.redirect('/admin/login');
})

module.exports = router;