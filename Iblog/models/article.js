import mongoose from 'mongoose'

const articleSchema = mongoose.Schema({
    title: {
        type: String,
        require: true
    },  //标题
    introduction: {    //简介（限制135字）
        type: String,
        maxlength: 135
    },
    content: String,    //内容
    type: {
        type: Number,
        default: 0 
    },  // 文章类型： 0：经典文章； 1：生活随笔
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