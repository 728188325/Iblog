import express from 'express'
const router = express.Router();

import mongoose from 'mongoose'
import articleModel from '../models/article'
import wordModel from '../models/word'
import wordComment from '../models/wordComment'
import moment from 'moment'
import multiparty from 'multiparty'
import fs from 'fs'


// 检测是否登录
router.post('/checkLogin',async function(req,res,next){
    try{
        if(req.session.userInfo){
            res.json({
                status: 200,
                userInfo: req.session.userInfo,
                msg: "您已登录~"
            })
        }else{
            res.json({
                status: 201,
                msg: "您还未登录，请先登录~"
            })
        }
    } catch (e) {
        console.log(e);
        res.json({
            status: 500,
            msg: "服务器错误，请重试~"
        })
    }
})

//退出登录
router.post('/logout',async function(req,res,next){
    try{
        req.session.userInfo = null;
        res.json({
            status: 200,
            msg: "死样，欢迎再次登录~"
        })
    } catch (e) {
        console.log(e);
        res.json({
            status: 500,
            msg: "服务器错误，请重试~"
        })
    }
})

//请求文章列表
router.post("/getArticles", async function (req, res, next) {
    try {
        let page = parseInt(req.body.page)||1;
        let limit = parseInt(req.body.limit)||10;//默认一页3篇文章
        let skipNum = (page-1)*limit;
        let count = await articleModel.countDocuments({}).exec();
        //限制请求页数和分页数目
        page = page<1?1:page;
        page = page>Math.ceil(count/limit)?Math.ceil(count/limit):page;
        let list = await articleModel.find({}).sort({publishTime:-1}).skip(skipNum).limit(limit).lean().exec();
        list.map((obj) => {
            let ts = moment(obj.publishTime).format("YYYY-MM-DD HH:mm:ss");
            obj.createTime = ts;
        })
        res.json({
            "status": 200,
            "code": 0,
            "msg": "数据请求成功",
            "count": count,
            "data": list
        })
    } catch (e) {
        console.log(e);
        res.json({
            status: 500,
            msg: "服务器错误，请重试~"
        })
    }
})

//查询文章详情
router.post("/getArticleDetail",async function(req,res,next){
    try{
        let id = req.body.id;
        let doc = await articleModel.findById(id).lean().exec();
        doc["createTime"] = moment(doc.publishTime).format("YYYY-MM-DD HH:mm:ss");
        res.json({
            status: 200,
            data: doc,
            msg: "查询文章详情成功~"
        })
    }catch(e){
        console.log(e);
        res.json({
            status: 500,
            msg: "服务器错误，请重试~"
        })
    }
})

//删除文章
router.post("/articleDelete",async function(req,res,next){
    try{
        let id = req.body.id;
        let doc = await articleModel.deleteOne({_id:id}).exec();
        if(doc.n===1){
            res.json({
                status:200,
                msg:"文章删除成功！"
            })
        }else{
            res.json({
                status:201,
                msg:"文章删除失败！"
            })
        }
    }catch(e){
        console.log(e);
        res.json({
            status: 500,
            msg: "服务器错误，请重试~"
        })
    }
})


//上传文章缩略图
router.post('/uploadThumbnail',async function(req,res,next){
    try{
        let form = new multiparty.Form();
        form.parse(req,function(err, field, files){
            if (err){
                res.json({
                    "code": 500,
                    "msg": "图片上传失败"
                })
            }
            let file = files.file[0];
            var rs = fs.createReadStream(file.path);
            var dstPath = '/uploadThumbnails/' + file.originalFilename;
            var ws = fs.createWriteStream('./public' + dstPath);
            rs.pipe(ws);
            ws.on('close', function() {
                console.log('文章缩略图上传成功');
                let nameArr = dstPath.split(".");
                let endFileName = nameArr[nameArr.length-1];
                let newfilename = '/uploadThumbnails/iblogmessage' + Date.now() + parseInt(Math.random() * 8999 +10000)+"."+endFileName;
                let newfilepath = './public'+newfilename;
                var oldfliepath = './public'+dstPath;
                fs.rename(oldfliepath,newfilepath, function(err){
                    if(err){
                        throw err;
                    }
                    //根据前端组件要求返回
                    //let fullPath = req.headers.origin + dstPath;
                    let fullPath = "http://"+req.headers.host + newfilename;
                    res.json({
                        "status": 200,
                        "code": 0, //0表示成功，其它失败
                        "msg": "缩略图上传成功", //提示信息 //一般上传失败后返回
                        "data": {
                            "src": fullPath,
                            "title": file.originalFilename //可选
                        }
                    })
                })
            })
        })
    }catch(e){
        console.log(e);
        res.json({
            status: 500,
            msg: "服务器错误，请重试~"
        })
    }
})

//上传文章图片
router.post('/uploadArticleImg',async function(req,res,next){
    try{
        let form = new multiparty.Form();
        form.parse(req,function(err, field, files){
            if (err){
                res.json({
                    "code": 500,
                    "msg": "图片上传失败"
                })
            }
            let file = files.file[0];
            var rs = fs.createReadStream(file.path);
            var dstPath = '/uploadArticleImg/' + file.originalFilename;
            var ws = fs.createWriteStream('./public' + dstPath);
            rs.pipe(ws);
            ws.on('close', function() {
                console.log('文章图片上传成功');
                let nameArr = dstPath.split(".");
                let endFileName = nameArr[nameArr.length-1];
                let newfilename = '/uploadArticleImg/iblogmessage' + Date.now() + parseInt(Math.random() * 8999 +10000)+"."+endFileName;
                let newfilepath = './public'+newfilename;
                var oldfliepath = './public'+dstPath;
                fs.rename(oldfliepath,newfilepath, function(err){
                    if(err){
                        throw err;
                    }
                    //根据前端组件要求返回
                    //let fullPath = req.headers.origin + dstPath;
                    let fullPath = "http://"+req.headers.host + newfilename;
                    res.json({
                        "status": 200,
                        "code": 0, //0表示成功，其它失败
                        "msg": "图片上传成功", //提示信息 //一般上传失败后返回
                        "data": {
                            "src": fullPath,
                            "title": file.originalFilename //可选
                        }
                    })
                })
            })
        })
    }catch(e){
        console.log(e);
        res.json({
            status: 500,
            msg: "服务器错误，请重试~"
        })
    }
})

//发布文章
router.post("/articlePublish",async function (req, res, next) {
    try{
        //数据验证
        if (!req.body.title) {
            return res.json({
                status: 500,
                msg: "文章标题不能为空！"
            })
        }
        if (!req.body.content) {
            return res.json({
                status: 500,
                msg: "文章内容不能为空！"
            })
        }
        let articleObj = {
            title: req.body.title, //标题
            introduction: req.body.introduction, //简介
            content: req.body.content, //内容
            type: req.body.type,
            //publishTime: Date.now(), //发布时间
            author: req.body.author, //作者
            imgUrl: req.body.imgUrl //缩略图
        }
        let id = req.body.id;
        if(id){
            //修改
            await articleModel.updateOne({_id:id},articleObj);
            res.json({
                status: 200,
                msg: "文章修改成功！"
            })
        }else{
            //发布
            let article = new articleModel(articleObj);
            await article.save();
            res.json({
                status: 200,
                msg: "文章发布成功！"
            })
        }
    }catch(e){
        console.log(e);
        res.json({
            status: 500,
            msg: "服务器错误，请重试~"
        })
    }
})

//查询文章详情
router.post("/articleDetail",async function(req,res,next){
    try{
        let id = req.body.id;
        let doc = await articleModel.findById(id).lean().exec();
        doc["createTime"] = moment(doc.publishTime).format("YYYY-MM-DD HH:mm:ss");
        res.json({
            status: 200,
            msg: "文章详情查询成功~",
            data: doc
        })
    }catch(e){
        console.log(e);
        res.json({
            status: 500,
            msg: "服务器错误，请重试~"
        })
    }
})



//请求留言板列表
router.post("/getMsgList", async function (req, res, next) {
    try {
        let page = parseInt(req.body.page)||1;
        let limit = parseInt(req.body.limit)||10;//默认一页3篇文章
        let skipNum = (page-1)*limit;
        let count = await wordModel.countDocuments({}).exec();
        //限制请求页数和分页数目
        page = page<1?1:page;
        page = page>Math.ceil(count/limit)?Math.ceil(count/limit):page;
        let list = await wordModel.find({}).sort({publishTime:-1}).skip(skipNum).limit(limit).lean().exec();
        list.map((obj) => {
            let ts = moment(obj.publishTime).format("YYYY-MM-DD HH:mm:ss");
            obj.createTime = ts;
        })
        res.json({
            "status": 200,
            "code": 0,
            "msg": "数据请求成功",
            "count": count,
            "data": list
        })
    } catch (e) {
        console.log(e);
        res.json({
            status: 500,
            msg: "服务器错误，请重试~"
        })
    }
})

//留言详情
router.post('/getMsgDetail',async function(req,res,next){
    try{
        let id = req.body.id;
        let list = await wordModel.aggregate([
            {
                $lookup:{
                    from: "wordComment",
                    localField: "_id",
                    foreignField: "word_id",
                    as: "commentList"
                }
            },
            {
                $match:{
                    _id:mongoose.Types.ObjectId(id)
                }
            }
        ]).exec();
        let doc = list[0];
        doc.createTime = moment(doc.publishTime).format("YYYY-MM-DD HH:mm:ss");
        console.log(doc);
        /* res.render('wordDetail',{
            userInfo: req.session.userInfo,
            data:doc
        }); */
        res.json({
            status: 200,
            msg: "留言板详情查询成功~",
            data: doc
        })
    }catch(e){
        console.log(e);
        res.json({
            status: 500,
            msg: "服务器错误，请重试~"
        })
    }
})

//删除留言
router.post("/msgDelete",async function(req,res,next){
    try{
        let id = req.body.id;
        let doc = await wordModel.deleteOne({_id:id}).exec();
        let comments = await wordComment.deleteMany({word_id:id}).exec();
        if(doc.n===1){
            res.json({
                status:200,
                msg:"留言删除成功！"
            })
        }else{
            res.json({
                status:201,
                msg:"留言删除失败！"
            })
        }
    }catch(e){
        console.log(e);
        res.json({
            status: 500,
            msg: "服务器错误，请重试~"
        })
    }
})

//删除评论
router.post("/msgCommentDelete",async function(req,res,next){
    try{
        let id = req.body.id;
        let doc = await wordComment.deleteOne({_id:id}).exec();
        if(doc.n===1){
            res.json({
                status:200,
                msg:"删除成功！"
            })
        }else{
            res.json({
                status:201,
                msg:"删除失败！"
            })
        }
    }catch(e){
        console.log(e);
        res.json({
            status: 500,
            msg: "服务器错误，请重试~"
        })
    }
})


module.exports = router;