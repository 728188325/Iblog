import mongoose from 'mongoose'

//留言板回复表
const wordCommentSchema = mongoose.Schema({
    word_id: mongoose.Schema.Types.ObjectId, //关联留言板
    content: String, //回复内容
    commentTime:{
        type: Date,
        default: Date.now
    }, //回复时间
    from:String //回复人地址
})

const WordComment = mongoose.model('WordComment',wordCommentSchema,'wordComment');

export default WordComment