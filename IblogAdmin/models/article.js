import mongoose from 'mongoose'

const articleSchema = mongoose.Schema({
    title: {
        type: String,
        require: true
    },  //标题
    content: String,    //内容
    type: {
        type: Number,
        default: 0 
    },  // 文章类型： 0：唯美语录； 1：日志
    publishTime: {
        type: Date,
        default: Date.now
    },    //发布时间
    author: String,     //作者
    imgUrl: String,     //缩略图
    readNum: {
        type: Number,
        default: 0
    },    //阅读数
    thumbUp: {
        type: Number,
        default: 0
    }     //点赞数
})

const Article = mongoose.model('Article',articleSchema,'article');

export default Article