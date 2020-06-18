module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
    outputDir: 'dist', // 所有文件打包到dist目录下，包括index.html,
    assetsDir: 'src', // 所有静态资源放到指定目录微信下
    devServer: {
        open: false, // 是否自动弹出浏览器页面
        host: 'localhost',
        port: '8081',
        https: false,
        hotOnly: false,
        proxy: {
            '': {
                target: 'http://localhost:3002', // API服务器的地址
                ws: true, // 代理websockets
                changeOrigin: true // 虚拟的站点需要更管origin
                /* pathRewrite: { // 重写路径 比如'/api/aaa/ccc'重写为'/aaa/ccc'
                    '^/platform': ''
                } */
            }
        }
    }
}
