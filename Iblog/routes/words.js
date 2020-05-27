import express from 'express'
const router = express.Router();

import mongoose from 'mongoose'
import multiparty from 'multiparty'
import fs from 'fs'
import moment from 'moment'

import wordModel from '../models/word'
import wordCommentModel from '../models/wordComment'


router.post('/uploadImg',function(req,res,next){
    var form = new multiparty.Form();
    form.parse(req, function(err, field, files) {
        if (err){
            res.json({
                "status": 500,
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
            //根据前端组件要求返回
            //let fullPath = req.headers.origin + dstPath;
            let fullPath = "http://"+req.headers.host + dstPath;
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

router.post('/publish',async function(req,res,next){
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

//获取留言列表
router.post('/getList', async function(req,res,next){
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

router.get('/detail',async function(req,res,next){
    try{
        let id = req.query.id;
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
        res.render('wordDetail',{
            data:doc
        });
    }catch(e){
        console.log(e);
        res.json({
            status: 500,
            msg: "服务器错误，请重试~"
        })
    }
})

router.post('/comment',async function(req,res,next){
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

router.post('/thumbUp',async function(req,res,next){
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


export default router