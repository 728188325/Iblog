import express from 'express'
const router = express.Router();

import mongoose from 'mongoose'
import moment from 'moment'
import wordModel from '../models/word'
import wordComment from '../models/wordComment'


//请求留言板列表
router.get("/", async function (req, res, next) {
    try {
        let page = parseInt(req.query.page)||1;
        let limit = parseInt(req.query.limit)||10;//默认一页3篇文章
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
        let doc = list[0];
        doc.createTime = moment(doc.publishTime).format("YYYY-MM-DD HH:mm:ss");
        console.log(doc);
        res.render('wordDetail',{
            userInfo: req.session.userInfo,
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

//删除文章
router.post("/delete",async function(req,res,next){
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

router.post("/comment/delete",async function(req,res,next){
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


export default router