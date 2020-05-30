<template>
	<view class="container" v-if="Object.keys(wordDetail).length">
		<view class="thumb-up" @click="thumbUp()">
			<image class="thumb-up-icon" src="../../static/article/thumbUp.png" mode="aspectFill"></image>
			<text class="thumb-up-text">{{wordDetail.thumbUp}}</text>
		</view>
		<view class="list-content">
			<rich-text :nodes="wordDetail.content" style="font-size: 14px;"></rich-text>
			<view class="tip">
				<text class="from">来自：{{wordDetail.from}}</text>
				<text class="date">{{wordDetail.createTime}}</text>
			</view>
		</view>
		<textarea class="comment" placeholder-style="color:#F76260"
		 placeholder="大侠评论一个再走≥Ö‿Ö≤" :value="commentContent" @input="commentInput"/>
		<view class="button-sp-area">
			<button class="mini-btn" type="primary" size="mini" @click="comment()">评论</button>
		</view>
		<view class="comment-list">
			<view class="comment-item" v-for="item in wordDetail.commentList" :key="item._id">
				<view class="comment-content">
					<text class="comment-content-text">{{item.content}}</text>
				</view>
				<view class="comment-ts">
					<text class="comment-ts-text">{{item.commentTime|formatDate}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import htmlParser from '@/common/html-parser'
	function parseImgs(nodes) {
		nodes.forEach(node => {
			if (
				node.name === 'img'
			) {
				const width = uni.upx2px(690);
				node.attrs.style = `max-width:${width}px;`
			}
			if (Array.isArray(node.children)) {
				parseImgs(node.children)
			}
		})
		return nodes
	}
	export default {
		data() {
			return {
				id: null,
				wordDetail: {},
				commentContent: ""
			}
		},
		onLoad(option){
			this.id = option.id;
			this.wordDetailRequest(option.id);
		},
		methods:{
			wordDetailRequest(id){
				uni.request({
					url: uni.getStorageSync("baseUrl")+"/appApi/word/detail",
					method: "post",
					dataType: "json",
					data: {
						id: id
					},
					success: (data) => {
						this.wordDetail = data.data.data;
						this.wordDetail.commentList = this.wordDetail.commentList.reverse();
						const nodes = htmlParser(data.data.data.content);
						this.wordDetail.content = parseImgs(nodes);
					}
				})
			},
			thumbUp(){
				uni.request({
					url: uni.getStorageSync("baseUrl")+"/appApi/word/thumbUp",
					method: "post",
					dataType: "json",
					data: {
						id: this.id
					},
					success: (data) => {
						uni.showToast({
							icon: "none",
						    title: data.data.msg,
						    duration: 2000
						});
						if(data.data.status==200){
							this.wordDetail.thumbUp++;
						}
					}
				})
			},
			commentInput(e){
				this.commentContent = e.detail.value;
			},
			comment(){
				uni.request({
					url: uni.getStorageSync("baseUrl")+"/appApi/word/comment",
					method: "post",
					dataType: "json",
					data:{
						word_id: this.id,
						content: this.commentContent,
						from: "app端"
					},
					success: (data) => {
						uni.showToast({
							icon: "none",
						    title: data.data.msg,
						    duration: 2000
						});
						if(data.data.status==200){
							this.wordDetail.commentList.unshift(data.data.data);
							this.commentContent = "";
						}
					}
				})
			}
		},
		filters:{
			/**
			 * 将时间戳或者中国标准时间处理成 2018-05-01 00:00:00  这种格式
			 * @param {时间戳或者中国标准时间} timestamp 
			 */
			formatDate(time) {
				if(time.length<20) return time;
				let timestamp = new Date(time);
				let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
				let Y = date.getFullYear();
				let M = date.getMonth()+1;
				M = M.toString().length<2?"0"+M:M;
				let D = date.getDate();
				D = D.toString().length<2?"0"+D:D;
				let h = date.getHours();
				h = h.toString().length<2?"0"+h:h;
				let m = date.getMinutes();
				m = m.toString().length<2?"0"+m:m;
				let  s = date.getSeconds();
				s = s.toString().length<2?"0"+s:s;
				let result = Y+"-"+M+"-"+D+" "+h+":"+m+":"+s;
				return result;
			}
		}
	}
</script>

<style scoped>
	.container{
		padding: 20rpx 30rpx;
	}
	.thumb-up{
		display: flex;
		flex-direction: column;
		position: fixed;
		bottom: 140rpx;
		right: 60rpx;
		width: 150rpx;
		height: 150rpx;
		border-radius: 150rpx;
		background-color: rgba(33,150,243,0.6);
		z-index: 9;
		align-items: center;
		justify-content: center;
	}
	.thumb-up-icon{
		width: 80rpx;
		height: 80rpx;
		margin-bottom: 6rpx;
	}
	.thumb-up-text{
		font-size: 28rpx;
		color: #cf1010;
	}
	.list-content{
		padding: 20rpx 0;
	}
	.panel{
		flex-direction: row;
		justify-content: center;
		color: #555;
		font-size: 30rpx;
	}
	.list-img{
		width: 220rpx;
		height: 150rpx;
	}
	.introduction{
		color: #555;
		font-size: 30rpx;
	}
	.tip{
		display: flex;
		margin-top: 20rpx;
		flex-direction: row;
		justify-content: space-between;
	}
	.author{
		text-align: right;
	}
	.author,
	.date,
	.from,
	.thumbUp{
		line-height: 30rpx;
		font-size: 26rpx;
		color: #999;
	}
	.comment{
		width: 690rpx;
		height: 200rpx;
		margin: 20rpx 0;
		padding: 8rpx;
		border-style: solid;
		border-width: 1rpx;
		border-color: #ddd;
		color: #555;
	}
	.button-sp-area{
		flex-direction: column;
		justify-content: flex-end;
	}
	.mini-btn{
		margin-right: 0;
	}
	.comment-list{
		padding: 20rpx 0;
	}
	.comment-item{
		margin: 10rpx 0;
		border-bottom-width: 1px;
		border-bottom-style: dashed;
		border-bottom-color: #ddd;
	}
	.comment-content{
		
	}
	.comment-content-text{
		color: #555;
		font-size: 28rpx;
	}
	.comment-ts{
		padding: 10rpx 0;
	}
	.comment-ts-text{
		text-align: right;
		color: #555;
		font-size: 28rpx;
	}
</style>
