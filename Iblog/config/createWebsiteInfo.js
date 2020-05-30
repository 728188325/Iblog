import websiteModel from '../models/website'

websiteModel.find({
    "identifier": "001"
}, function (err, doc) {
    if (err) return console.log("站点信息查询失败", err);
    // 如果数据库不存在超级管理员，则创建超级管理员
    if (doc.length === 0) {
        let websiteObj = new websiteModel({
            "identifier": "001"
        })
        websiteObj.save(function (err, result) {
            if (err) return console.log("站点信息创建失败", err);
            console.log("站点信息创建成功", result);
        })
    }
})