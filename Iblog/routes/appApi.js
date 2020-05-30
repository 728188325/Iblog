import express from 'express'
const router = express.Router();

import multiparty from 'multiparty'
import fs from 'fs'
import moment from 'moment'

import mongoose from 'mongoose'
import articleModel from '../models/article.js'
import wordModel from '../models/word.js'
import wordCommentModel from '../models/wordComment.js'


//请求文章列表
router.post("/article", async function (req, res, next) {
    try {
        let page = parseInt(req.body.page)||1;
        let limit = parseInt(req.body.limit)||10;//默认一页3篇文章
        let condition = req.body.type!=undefined?{type:req.body.type}:{};
        let skipNum = (page-1)*limit;
        let count = await articleModel.countDocuments(condition).exec();
        //限制请求页数和分页数目
        page = page<1?1:page;
        page = page>Math.ceil(count/limit)?Math.ceil(count/limit):page;
        let list = await articleModel.find(condition).sort({publishTime:-1}).skip(skipNum).limit(limit).lean().exec();
        list.map((obj) => {
            let ts = moment(obj.publishTime).format("YYYY-MM-DD HH:mm:ss");
            obj.createTime = ts;
        })
        res.json({
            "code": 0,
            "msg": "数据请求成功",
            "count": count,
            "data": list,
            "status":200
        })
    } catch (e) {
        console.log(e);
        res.json({
            status: 500,
            msg: "服务器错误，请重试~"
        })
    }
})

//文章详情(请求一次阅读数+1)
router.post("/article/detail",async function(req,res,next){
    try{
        let id = req.body.id;
        let article = await articleModel.findOne({_id:id}).lean().exec();
        let readNum = typeof article.readNum=="undefined"?1:article.readNum+1;
        let doc = await articleModel.findOneAndUpdate({_id:id},{readNum:readNum}).lean().exec();
        let ts = moment(doc.publishTime).format("YYYY-MM-DD HH:mm:ss");
        doc.createTime = ts;
        res.json({
        	status: 200,
        	article:doc
        });
    } catch (e) {
        console.log(e);
        res.json({
            status: 500,
            msg: "服务器错误，请重试~"
        })
    }
})

//文章点赞
router.post('/article/thumbUp',async function(req,res,next){
    try{
        let id = req.body.id;
        let doc = await articleModel.findOne({_id:id}).exec();
        let num = doc.thumbUp + 1;
        await articleModel.updateOne({
            _id:id
        },{
            thumbUp: num
        })
        res.json({
            status: 200,
            msg: "点赞成功~"
        })
    }catch(e){
        console.log(e);
        res.json({
            status: 500,
            msg: "服务器错误，请重试~"
        })
    }
})


//获取留言列表
router.post('/word/getList', async function(req,res,next){
    try{
        let page = req.body.page||1;
        let limit = req.body.limit||10;
        let skip = (page-1)*limit;
        let count = await wordModel.countDocuments().exec();
        let list = [];
        if(skip<count){
            list = await wordModel.aggregate([
                {
                    $sort:{
                        publishTime:-1//排序规则
                    }
                },
                {
                    $skip:Number(skip)
                },
                {
                    $limit:Number(limit)
                },
                {
                    $lookup:{
                        from: "wordComment",
                        localField: "_id",
                        foreignField: "word_id",
                        as: "commentList"
                    }
                }
            ]).exec();
            list.map((item) => {
                item.createTime = moment(item.publishTime).format("YYYY-MM-DD HH:mm:ss");
                item.commentNum = item.commentList.length;
            })
        }
        res.json({
            status: 200,
            msg: "留言板列表请求成功~",
            data: list,
            count: count
        })
    }catch(e){
        console.log(e);
        res.json({
            status: 500,
            msg: "服务器错误，请重试~"
        })
    }
})

//留言详情
router.post('/word/detail',async function(req,res,next){
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
        //console.log(list,"---------------");
        let doc = list[0];
        doc.createTime = moment(doc.publishTime).format("YYYY-MM-DD HH:mm:ss");
        res.json({
        	status: 200,
            data: doc
        });
    }catch(e){
        console.log(e);
        res.json({
            status: 500,
            msg: "服务器错误，请重试~"
        })
    }
})

//留言点赞
router.post('/word/thumbUp',async function(req,res,next){
    try{
        let id = req.body.id;
        let doc = await wordModel.findOne({_id:id}).exec();
        let num = doc.thumbUp + 1;
        await wordModel.updateOne({
            _id:id
        },{
            thumbUp: num
        })
        res.json({
            status: 200,
            msg: "点赞成功~"
        })
    }catch(e){
        console.log(e);
        res.json({
            status: 500,
            msg: "服务器错误，请重试~"
        })
    }
})

//留言评论
router.post('/word/comment',async function(req,res,next){
    try{
        let commentObj = new wordCommentModel({
            word_id: req.body.word_id,
            content: req.body.content,
            from: req.body.from
        })
        let doc = await commentObj.save();
        doc = doc.toObject();
        doc.commentTime = moment(doc.commentTime).format("YYYY-MM-DD HH:mm:ss");
        res.json({
            status: 200,
            msg: "回复成功啦~",
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

//留言发布
router.post('/word/publish',async function(req,res,next){
    try{
        let word = new wordModel({
            content: req.body.content,
            from: req.body.from
        })
        let doc = await word.save();
        doc = JSON.parse(JSON.stringify(doc));
        doc.createTime = moment(doc.publishTime).format("YYYY-MM-DD HH:mm:ss");
        doc.commentNum = 0;
        res.json({
            status: 200,
            data: doc,
            msg: "留言成功啦!"
        })
    }catch(e){
        console.log(e);
        res.json({
            status: 500,
            msg: "服务器错误，请重试~"
        })
    }
})

//留言板上传图片
router.post('/word/uploadImg',function(req,res,next){
    var form = new multiparty.Form();
    form.parse(req, function(err, field, files) {
        if (err){
            res.json({
                "code": 500,
                "msg": "图片上传失败"
            })
        }
        let file = files.file[0];
        /* var file = files.filedata[0]; */
        var rs = fs.createReadStream(file.path);
        var dstPath = '/wordUploads/' + file.originalFilename;
        var ws = fs.createWriteStream('./public' + dstPath);
        rs.pipe(ws);
        ws.on('close', function() {
            console.log('文件上传成功');
            let nameArr = dstPath.split(".");
            let endFileName = nameArr[nameArr.length-1];
            let newfilename = '/wordUploads/iblogmessage' + Date.now() + parseInt(Math.random() * 8999 +10000)+"."+endFileName;
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
})


export default router