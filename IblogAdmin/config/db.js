var mongoose = require('mongoose');

//mongoose.Promise = global.Promise;

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://127.0.0.1:27017/user',{
    useUnifiedTopology: true,
    useNewUrlParser: true 
},function(err,db){
    if(err) return console.log("数据库连接失败",err);
    console.log("数据库连接成功");
})

module.exports = mongoose;