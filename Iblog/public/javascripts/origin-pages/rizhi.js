
$(function () {
    //初始化请求加载列表数据
    articleListInit(1,5,1);
});
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