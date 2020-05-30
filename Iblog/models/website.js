import mongoose from 'mongoose'

const websiteSchema = mongoose.Schema({
    identifier:{
        type: String,
        unique: true
    },//唯一标识（网站信息只创建一条）
    visits: {
        type: Number,
        default: 0
    },    //访问数数
    thumbUp: {
        type: Number,
        default: 0
    },    //点赞数
    websiteName: {
        type: String,
        default: "神奇的海蛎仔"
    }    //博客名称
})

const Website = mongoose.model('Website',websiteSchema,'website');

export default Website
