import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
    userName: {
        type: String,
        unique: true  //唯一索引
    },  //账号
    password: String,   //密码
    type: Number,  // 用户类型： 0:超级管理员；1管理员；2普通用户
    gender: Number,  // 性别：男：1；女：0
    nick: String  // 昵称
})

const User = mongoose.model('User',userSchema,'user');

export default User
