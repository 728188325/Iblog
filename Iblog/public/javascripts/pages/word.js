
//根据ip获取当前城市位置
if(typeof returnCitySN=="undefined"){
    let returnCitySN = {
        cname: "CHINA"
    }
}
layui.use(['layedit', 'upload', 'laypage'], function () {
    const layer = layui.layer,
        layedit = layui.layedit,
        $ = layui.jquery,
        upload = layui.upload,
        laypage = layui.laypage;

    let flag = true,
        page = 1,
        limit = 5;
        count = 6;
    getMoreMsgList(page,limit);
    $(document).scroll(async function(){
        if(page*limit>=count) return;
        let _scrollTop = $(document).scrollTop();
        let viewHeight = $(window).height();
        let documentHeight = $(document).height();
        if(flag&&documentHeight-_scrollTop-viewHeight<100){
            flag = false;
            page++;
            await getMoreMsgList(page,limit);
            flag = true;
        }
    })
    //创建一个编辑器
    let editIndex = layedit.build('LAY_demo_editor', {
        tool: ['face', 'image'],
        height: 150,
        uploadImage: {
            url: '/words/uploadImg', //接口url
            type: 'post' //默认post
        }
    });
    //layedit.setContent(editIndex, "大侠，留个言再走吧\\﻿ (•◡•) /",true);
    $('.layui-form #LAY_layedit_1').contents().find('body').html('大侠，留个言再走吧\\﻿ (•◡•) /');
    $("#btn-clear").on("click",function(){
        $('.layui-form #LAY_layedit_1').contents().find('body').html('');
    })
    $("#leaveMsg").on("click",function(){
        let content = layedit.getContent(editIndex);
        if($.trim(content)==""){
            return layer.msg("请输入留言内容~",{time:2000});
        }
        let param = {
            content:content,
            from: returnCitySN.cname
        }
        $.ajax({
            type: "post",
            url:"/words/publish",
            dataType:"json",
            data:param,
            success: (data) =>{
                layer.msg(data.msg,{time:2000});
                if(data.status==200){
                    $('.layui-form #LAY_layedit_1').contents().find('body').html('');
                    var _li = ['<li>',
                        '<a href="/words/detail?id='+data.data._id+'" style="text-decoration: none;">',
                            '<div name="liContent">',
                                '<h2>'+data.data.createTime+'</h2>',
                                '<p>'+data.data.content+'</p>',
                            '</div>',
                            '<h3>来自: '+data.data.from+'</h3>',
                            '<h4 onclick="thumbUp(this,\''+data.data._id+'\')">',
                                '<i class="fa fa-thumbs-up" aria-hidden="true" onclick="javascript:return false;"></i>',
                                '<span onclick="javascript:return false;">（'+data.data.thumbUp+'）</span></h4>',
                            '<h4><i class="fa fa-commenting" aria-hidden="true"></i>（'+data.data.commentNum+'）</h4>',
                        '</a>',
                    '</li>'].join("");
                    $("#msgList").prepend(_li);
                    wordStyleInit(null,0);
                }
            }
        })
    })
})
/**
 * @description: 留言板样式渲染
 * @param skip{Number} 渲染位置，从第几条开始
 * @param index{Number} 如果传该参数，指定设置该条li
 * @return: 
 */
function wordStyleInit(skip,index){
    if(typeof index=="undefined"){
        skip = skip<=-1?"":":gt("+skip+")";
    }else{
        skip = ":eq("+index+")";
    }
    $("#msgList>li"+skip).each(function(index,item){
        let colorArr = ["#FAC8C8","#cfc","#ffc","#ccf","#f098ff","#dadada","#ceff95","#84c8ff","#c3d8e2","#ff9b93"]
        let rand = Math.floor( Math.random() * colorArr.length );
        // 随机从数组中取出某值
        let itemColor = colorArr[rand];
        let rotateArr = ['-6','-5.5','-5','-5','-4','0','4','5','5.5','6'];
        let itemRotate = rotateArr[rand];
        let transformVal = "rotate("+itemRotate+"deg)";
        $(item).children("a").css({"background":itemColor,"transform": transformVal});
    })
}
/**
 * @description: 请求留言板列表数据
 * @param page{Number} 当前页
 * @param limit{Number} 每页显示数据量
 * @return: 
 */
async function getMoreMsgList(page,limit){
    $(".list-load-tip").show();
    page = page?page:1;
    limit = limit?limit:10;
    await $.ajax({
        type: "post",
        url: "words/getList",
        dataType: "json",
        data:{
            page: page,
            limit: limit
        },
        success: (data) => {
            if(data.status==200){
                count = data.count;
                if(page*limit>=count){
                    $(".list-load-tip").text("已经全部加载完成了(ô‿ô)");
                }else{
                    $(".list-load-tip").hide();
                };
                var _html = template('msgDetail',data.data);
                $("#msgList").append(_html);
                var skip = (page-1)*limit - 1;
                wordStyleInit(skip);
            }
        }
    })
}

/**
 * @description: 留言点赞
 * @param event{Object} 节点对象
 * @param id{String} 留言id
 * @return: 
 */
 function thumbUp(event,id){
    //let id = $(this).parent().attr("id");
    var thumbUpWords = JSON.parse(window.localStorage.getItem("thumbUpWords"))||[];
    if(thumbUpWords.includes(id)){
        layer.msg("不能再点赞了，我怀疑你是个机器人~",{time:2000});
        return;
    }else{
        thumbUpWords.push(id);
        window.localStorage.setItem("thumbUpWords",JSON.stringify(thumbUpWords));
    }
    
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