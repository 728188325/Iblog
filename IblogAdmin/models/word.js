import mongoose from 'mongoose'

const wordSchema = mongoose.Schema({
    content: String,    //内容
    from: String,   //发布人地址
    publishTime: {
        type: Date,
        default: Date.now
    },    //留言时间
    thumbUp: {
        type: Number,
        default: 0
    }    //点赞数
})

const Word = mongoose.model('Word',wordSchema,'word');

export default Word