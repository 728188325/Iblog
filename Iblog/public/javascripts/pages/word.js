!function(t){var e={};function a(n){if(e[n])return e[n].exports;var i=e[n]={i:n,l:!1,exports:{}};return t[n].call(i.exports,i,i.exports,a),i.l=!0,i.exports}a.m=t,a.c=e,a.d=function(t,e,n){a.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},a.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},a.t=function(t,e){if(1&e&&(t=a(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(a.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)a.d(n,i,function(e){return t[e]}.bind(null,i));return n},a.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return a.d(e,"a",e),e},a.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},a.p="",a(a.s=6)}({6:function(t,e){let a=!0,n=1,i=6,o=100;if("undefined"==typeof returnCitySN){}function r(t,e){t=void 0===e?t<=-1?"":":gt("+t+")":":eq("+e+")",$("#msgList>li"+t).each((function(t,e){let a=["#FAC8C8","#cfc","#ffc","#ccf","#f098ff","#dadada","#ceff95","#84c8ff","#c3d8e2","#ff9b93"],n=Math.floor(Math.random()*a.length),i=a[n],o="rotate("+["-6","-5.5","-5","-5","-4","0","4","5","5.5","6"][n]+"deg)";$(e).children("a").css({background:i,transform:o})}))}async function l(t,e){$(".list-load-tip").show(),t=t||1,e=e||10,await $.ajax({type:"post",url:"words/getList",dataType:"json",data:{page:t,limit:e},success:a=>{if(200==a.status){i=a.count,t*e>=i?$(".list-load-tip").text("已经全部加载完成了(ô‿ô)"):$(".list-load-tip").hide();var o=template("msgDetail",a.data);$("#msgList").append(o),r((t-1)*e-1),$("body").height()<$(window).height()&&(n++,l(n,e))}}})}layui.use(["layedit","upload","laypage"],(function(){const t=layui.layer,e=layui.layedit,u=layui.jquery;layui.upload,layui.laypage;u(window).height()>1e3&&(o=200),l(n,5),u(document).scroll((async function(){if(5*n>=i)return;let t=u(document).scrollTop(),e=u(window).height(),r=u(document).height();a&&r-t-e<o&&(a=!1,n++,await l(n,5),a=!0)}));let d=e.build("LAY_demo_editor",{tool:["face","image"],height:150,uploadImage:{url:"/words/uploadImg",type:"post"}});u(".layui-form #LAY_layedit_1").contents().find("body").html("大侠，留个言再走吧\\\ufeff (•◡•) /"),u("#btn-clear").on("click",(function(){u(".layui-form #LAY_layedit_1").contents().find("body").html("")})),u("#leaveMsg").on("click",(function(){let a=e.getContent(d);if(""==u.trim(a))return t.msg("请输入留言内容~",{time:2e3});let n={content:a,from:returnCitySN.cname};u.ajax({type:"post",url:"/words/publish",dataType:"json",data:n,success:e=>{if(t.msg(e.msg,{time:2e3}),200==e.status){u(".layui-form #LAY_layedit_1").contents().find("body").html("");var a=["<li>",'<a href="/words/detail?id='+e.data._id+'" style="text-decoration: none;">','<div name="liContent">',"<h2>"+e.data.createTime+"</h2>","<p>"+e.data.content+"</p>","</div>","<h3>来自: "+e.data.from+"</h3>","<h4 onclick=\"thumbUp(this,'"+e.data._id+"')\">",'<i class="fa fa-thumbs-up" aria-hidden="true" onclick="javascript:return false;"></i>','<span onclick="javascript:return false;">（'+e.data.thumbUp+"）</span></h4>",'<h4><i class="fa fa-commenting" aria-hidden="true"></i>（'+e.data.commentNum+"）</h4>","</a>","</li>"].join("");u("#msgList").prepend(a),r(null,0)}}})}))})),window.thumbUp=function(t,e){var a=JSON.parse(window.localStorage.getItem("thumbUpWords"))||[];a.includes(e)?layer.msg("不能再点赞了，我怀疑你是个机器人~",{time:2e3}):(a.push(e),window.localStorage.setItem("thumbUpWords",JSON.stringify(a)),(t=t||window.event).preventDefault?t.preventDefault():t.returnValue=!1,$.ajax({url:"/words/thumbUp",type:"post",data:{id:e},dataType:"json",success:function(e){if(layer.msg(e.msg,{time:2e3}),200==e.status){let e=$(t).children("span").text().substr(1);e=parseInt(e.substr(0,e.length-1))+1,$(t).children("span").text("（"+e+"）")}}}))}}});