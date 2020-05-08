import User from '../models/user'

User.find({
    "userName": "admin"
}, function (err, doc) {
    if (err) return console.log("超级管理员查询失败", err);
    // 如果数据库不存在超级管理员，则创建超级管理员
    if (doc.length === 0) {
        let adminUser = new User({
            userName: "admin",
            password: "1",
            type: 0,
            gender: 1,
            nick: "神奇的海蛎仔"
        })
        adminUser.save(function (err, result) {
            if (err) return console.log("超级管理员创建失败", err);
            console.log("超级管理员创建成功", result);
        })
    }
})