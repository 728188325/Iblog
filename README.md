# Iblog
个人博客与博客后台管理系统
        
    
      
相关技术栈： express + mongoose + layui + webpack + uniapp + vue + elementUI
     
   
     
本项目为个人博客展示与管理系统，可以在多端上运行：      
pc端：127.0.0.1:3001   
后台管理：127.0.0.1:3000   
手机端：127.0.0.1:3001/h5   
还可以在首页扫描下载app      
app代码也支持微信小程序（经测试但未上线）   
vue后台管理系统：127.0.0.1:3002(账号：admin；密码：iblog1234)
            
            
利用webpack将项目页面js打包压缩   
原js目录：/public/javascripts/origin-pages   
打包后目录：/public/javascripts/pages   
       

启动项目前要先用webpack打包相关js   
     
       
    
前台展示系统与后台管理系统分开所以需进入各自的项目安装   
npm install    
npm start    


vue后台管理系统框架：
由vue-cli创建的iblogadminvue打包放在IblogVuePlatform（express）项目下运行




