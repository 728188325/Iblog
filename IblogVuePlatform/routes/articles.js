import express from 'express'
const router = express.Router();

import moment from 'moment'
import multiparty from 'multiparty'
import fs from 'fs'

import articleModel from '../models/article'


//请求文章列表
router.get("/", async function (req, res, next) {
    try {
        let page = parseInt(req.query.page)||1;
        let limit = parseInt(req.query.limit)||10;//默认一页3篇文章
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

//发布文章
router.post("/publish",async function (req, res, next) {
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
router.get("/detail",async function(req,res,next){
    try{
        let id = req.query.id;
        let doc = await articleModel.findById(id).lean().exec();
        doc["createTime"] = moment(doc.publishTime).format("YYYY-MM-DD HH:mm:ss");
        res.render('detail',{
            userInfo: req.session.userInfo,
            data:doc
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
router.post("/delete",async function(req,res,next){
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

//文章发布页/修改页
router.get("/publish",async function(req,res,next){
    try{
        let id = req.query.id;
        let doc ={};
        if(id){
            doc = await articleModel.findById(id).exec();
        }
        res.render('publish', { 
            userInfo: req.session.userInfo,
            article: doc
        });
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

export default router