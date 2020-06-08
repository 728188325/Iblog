
var path = require('path');
var glob = require('glob') //获取全部文件的插件
var publicDir = path.resolve(__dirname, './public'); //获取所有静态资源文件绝对路径
var entries = function () {
    var jsDir = path.resolve(publicDir, 'javascripts/origin-pages') //获取js目录下的所有文件
    var entryFiles = glob.sync(jsDir + '/*.js') //获取所有.js文件
    var map = {};
    for (var i = 0; i < entryFiles.length; i++) {
        var filePath = entryFiles[i]; //.js文件的地址
        var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.')); //。js的文件名称
        map[filename] = filePath;
    }
    //console.log(map,"--------");
    return map; //所有js文件的对应的webpack入口文件的格式 {filename:filePath,} 
}
var config = {
    entry: entries,
    output: {
        path: path.resolve(process.cwd(), 'public/javascripts/pages'),
        //[name]-[hash].js可以指定hash值。
        filename: '[name].js',
    },
    plugins: [
        
    ],
    module: {
        rules: [
            /* {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        [
                            '@babel/preset-env',
                            {
                                useBuiltIns: 'usage',
                                corejs:{
                                    version: 3
                                },
                                targets: {
                                    chrome: '60',
                                    firefox: '60',
                                    ie: '9',
                                    safari: '10',
                                    edge: '17'
                                }
                            }
                        ]
                    ]
                }
            } */
        ]
    },
    mode: "production"
}
/* if (process.env.NODE_ENV == 'dev') {
    config.devtool = "source-map",
        config.mode = "development"
} else {
    config.mode = "production"
} */
module.exports = config