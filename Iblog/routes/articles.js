import express from 'express'
const router = express.Router();

import moment from 'moment'


import articleModel from '../models/article'


//请求文章列表
router.get("/", async function (req, res, next) {
    try {
        let page = parseInt(req.query.page)||1;
        let limit = parseInt(req.query.limit)||10;//默认一页3篇文章
        let condition = req.query.type?{type:req.query.type}:{};
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

//文章详情
router.get("/detail",async function(req,res,next){
    try{
        let id = req.query.id;
        let article = await articleModel.findOne({_id:id}).lean().exec();
        let readNum = typeof article.readNum=="undefined"?1:article.readNum+1;
        let doc = await articleModel.findOneAndUpdate({_id:id},{readNum:readNum}).lean().exec();
        let ts = moment(doc.publishTime).format("YYYY-MM-DD HH:mm:ss");
        doc.createTime = ts;
        res.render("articleDetail",{article:doc});
    } catch (e) {
        console.log(e);
        res.json({
            status: 500,
            msg: "服务器错误，请重试~"
        })
    }
})

//根据阅读数查找文章
router.post("/getHotArticles",async function(req,res,next){
    try{
        let limit = parseInt(req.body.limit)||8;
        let list = await articleModel.find({}).sort({readNum:1}).limit(limit).exec();
        res.json({
            status:200,
            data:list,
            msg:"文章请求成功~"
        })
    }catch(e){
        console.log(e);
        res.json({
            status: 500,
            msg: "服务器错误，请重试~"
        })
    }
})

//文章点赞
router.post('/thumbUp',async function(req,res,next){
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


export default router