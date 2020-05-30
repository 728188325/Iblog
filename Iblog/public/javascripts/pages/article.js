$(function () {
    articleListInit(1,5);
    websiteVisitsInit();

    var galleryThumbs = new Swiper('.gallery-thumbs', {
        spaceBetween: 10,
        slidesPerView: 4,
        freeMode: false,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
        autoplay: true,
        direction: 'vertical',
        loop: true
    });
    var galleryTop = new Swiper('.gallery-top', {
        spaceBetween: 10,
        autoplay: true,
        loop: true,
        navigation: {
            /* nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev', */
        },
        thumbs: {
            swiper: galleryThumbs,
        },
    });
});
/**
 * @description: 初始化请求加载文章列表数据
 * @param page{Number} 当前页
 * @param limit{Number} 每页显示数据量
 * @param type{String} 文章类型
 * @return: 
 */
function articleListInit(page,limit,type){
    page = page?page:1;
    limit = limit?limit:5;
    if(typeof type=="undefined"){
        type = "";
    }else{
        type = "&type="+type;
    }
    let url = "/articles?page="+page+"&limit="+limit+type;
    $.ajax({
        type: "GET",
        url: url,
        dataType:"json",
        xhrFields:{
            withCredentials:true
        },
        success: (data) => {
            if(data.status==200){
                if(data.count>0){
                    var _html = template('article-list',data.data);
                    $(".main-content").html(_html);
                    setArticleListPager(page, limit, data.count,type);
                }else{
                    $(".main-content").html('<p class="no-data">暂无相关数据</p>');
                }
            }
        }
    })
}
/**
 * @description: 设置文章列表分页
 * @param current{Number} 当前页
 * @param pageSize{Number} 每页显示数据量
 * @param total{Number} 总数据量
 * @param type{Number} 文章类型
 * @return: 
 */
function setArticleListPager(current, pageSize, total,type){
    $('.box').pagination({
        mode: 'fixed',
        current: current,
        totalData: total,
        showData: pageSize,
        coping: true,
        homePage: '首页',
        endPage: '末页',
        callback: function (api) {
            let page = api.getCurrent();
            limit = pageSize;
            let url = "/articles?page="+page+"&limit="+limit+type;
            $.ajax({
                type: "GET",
                url: url,
                dataType:"json",
                xhrFields:{
                    withCredentials:true
                },
                success: (data) => {
                    var _html = template('article-list',data.data);
                    $(".main-content").html(_html);
                }
            })
        }
    });
}
/**
 * @description: 网站底部访问人数统计
 * @param {type} 
 * @return: 
 */  
function websiteVisitsInit(){
    let websiteVisits = '<%= websiteInfo.visits %>'||0;
    var _html = "&nbsp;&nbsp;&nbsp;统计："+websiteVisits;
    $(".foot-copyright").append(_html);
}