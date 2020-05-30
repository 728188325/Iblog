var express = require('express');
var router = express.Router();

import websiteModel from '../models/website'

/* GET home page. */
router.get('/', async function(req, res, next) {
    try{
        let websiteInfo = await websiteModel.findOne({"identifier": "001"}).lean().exec();
        let visits = typeof websiteInfo.visits=="undefined"?1:websiteInfo.visits+1;
        let doc = await websiteModel.findOneAndUpdate({"identifier": "001"},{visits:visits}).lean().exec();
        res.render('index',{websiteInfo:doc});
    } catch (e) {
        console.log(e);
        res.json({
            status: 500,
            msg: "服务器错误，请重试~"
        })
    }
});

router.get('/weimei', function(req, res, next) {
    res.render('weimei');
});

router.get('/rizhi', function(req, res, next) {
    res.render('rizhi');
});

router.get('/about',function(req,res,next){
    res.render('about');
})

router.get('/word',function(req,res,next){
    res.render('word');
})


module.exports = router;
