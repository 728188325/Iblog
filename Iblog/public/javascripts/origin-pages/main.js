/*
 * @Author: your name
 * @Date: 2020-05-30 18:28:54
 * @LastEditTime: 2020-06-08 20:24:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vueNuxtAppe:\Express\Iblog\Iblog\public\javascripts\pages\main.js
 */ 

$(function () {
    switchangeInitTheme();
    goTop();
    window.onscroll = function () {
        setTopAndBack();
    };
    $("#search-btn").on("click",function(){
        alert("该狗逼程序猿搜索功能暂未开放！")
    })
    $(window).load(() => {
        pagePicLoad();
        $(".loading-mask").fadeOut();
        $(".music-box").html('<audio src="/music/李代沫 - 遗憾.mp3" controls="" autoplay="" loop="loop"></audio>');
    })
});
/**
 * @description: 设置栏目和返回顶部按钮
 * @return: 
 */
function setTopAndBack() {
    var top = document.documentElement.scrollTop || document.body.scrollTop;
    if (top <= 291) {
        $("#backToTop").fadeOut();
        $(".nav").css({ "position": "relative"});
    } else {
        $("#backToTop").fadeIn();
        $(".nav").css({ "position": "fixed","top":"0" });
    }
}
/**
 * @description: 返回顶部
 * @return: 
 */
function goTop() {
    $("#backToTop").on("click", function () {
        $("html,body").animate({ scrollTop: 0 }, 500);
    })
}
/**
 * @description: 监听切换网站主题并初始化网站主题
 * @param {type} 
 * @return: 
 */
function switchangeInitTheme(){
    function switchTheme(type){
        if(type==="1"){
            $("body").removeClass("theme-2 theme-3 theme-4");
            $("body").addClass("theme-1");
        }else if(type==="2"){
            $("body").removeClass("theme-1 theme-3 theme-4");
            $("body").addClass("theme-2");
        }else if(type==="3"){
            $("body").removeClass("theme-1 theme-2 theme-4");
            $("body").addClass("theme-3");
        }else if(type==="4"){
            $("body").removeClass("theme-1 theme-2 theme-3");
            $("body").addClass("theme-4");
        }
    }
    let localThemeType = "1";
    if(window.localStorage){
        let storage = window.localStorage;
        localThemeType = storage.getItem("themeType")?storage.getItem("themeType"):localThemeType;
    }
    switchTheme(localThemeType);
    $(".switch-theme").on("click",function(){
        let currentClass = $("body").prop("class");
        let num = currentClass.split("-")[1];
        if(parseInt(num)>=4) num="0";
        let nextThemeType  = (parseInt(num)+1).toString();
        switchTheme(nextThemeType);
        if(window.localStorage){
            window.localStorage.setItem("themeType",nextThemeType);
        }
    })
}

/**
 * @description: 图片懒加载：页面加载完之后再加载图片
 * @param {type} 
 * @return: 
 */
function pagePicLoad(){
    $("[data-src]").each((index,item) => {
        let src = $(item).attr("data-src");
        if($(item)[0].nodeName=="IMG"){
            $(item).prop("src",src);
        }else{
            $(item).css("background-image","url("+src+")");
        }
    })
}