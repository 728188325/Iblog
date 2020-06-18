module.exports = {
  apps : [
    {
      name      : 'IblogVuePlatform',
      script    : './bin/www',
      cwd:"./",
      log_date_format:"YYYY-MM-DD HH:mm:ss",
      watch:true,
      exec_interpreter:"babel-node",//此配置就是使用babel-node去执行nodejs文件
      exec_mode:"fork",
      env: {
        COMMON_VARIABLE: 'true'
      },
      env_production : {
        NODE_ENV: 'production'
      }
    }
  ]
}