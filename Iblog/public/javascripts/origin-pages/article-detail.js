
/* let ip = null;
//获取ip地址
let ip = typeof returnCitySN!="undefined"?returnCitySN.cip:"";
console.log(ip,returnCitySN); */
layui.use(['layer'], function () {
    $(".thumbUp-box-icon").on("click",function(){
        let id = $(this).parent().attr("id");
        var thumbUpArticles = JSON.parse(window.localStorage.getItem("thumbUpArticles"))||[];
        if(thumbUpArticles.includes(id)){
            layer.msg("不能再点赞了，这个作者都快飞上天了~",{time:2000});
            return;
        }else{
            thumbUpArticles.push(id);
            window.localStorage.setItem("thumbUpArticles",JSON.stringify(thumbUpArticles));
        }
        $.ajax({
            url: "/articles/thumbUp",
            type: "post",
            data: {
                id: id
            },
            dataType:"json",
            success: function(data){
                if(data.status==200){
                    let num = $(".thumbUp-box-num").text();
                    num = parseInt(num)+1;
                    $(".thumbUp-box-num").text(num);
                    $(".article-info-thumbUp").text(num);
                }else{
                    layer.msg(data.msg,{time:2000});
                }
            }
        })
    })
});