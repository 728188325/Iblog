
/**
 * @description:  点赞
 * @param event{Object} 节点对象
 * @param id{Sting} 文章id
 * @return: 
*/  
window.thumbUp = function thumbUp(event,id){
    event = event || window.event; 
    if(event.preventDefault){
        event.preventDefault();
    }else{
        event.returnValue = false;
    }
    $.ajax({
        url: "/words/thumbUp",
        type: "post",
        data: {
            id: id
        },
        dataType:"json",
        success: function(data){
            layer.msg(data.msg,{time:2000});
            if(data.status==200){
                let num = $(event).children("span").text().substr(1);
                num = parseInt(num.substr(0,num.length-1))+1;
                $(event).children("span").text("（"+num+"）");
            }
        }
    })
}
layui.use(['layedit', 'upload'], function () {
    var $ = layui.jquery;
    $("#leaveMsg").on("click",function(){
        let content = $("#msg").val();
        if($.trim(content)==""){
            return layer.msg("请输入回复内容~",{time:2000});
        }
        let param = {
            word_id: word_id,
            content:content,
            from: "CHINA"
        }
        $.ajax({
            type: "post",
            url:"/words/comment",
            dataType:"json",
            data:param,
            success: (data) =>{
                layer.msg(data.msg,{time:2000});
                if(data.status==200){
                    $('#msg').val('');
                    var _li = '<blockquote class="layui-elem-quote">'+data.data.commentTime+'：'+data.data.content+'</blockquote>'
                    $("#msgList").prepend(_li);
                }
            }
        })
    })
})