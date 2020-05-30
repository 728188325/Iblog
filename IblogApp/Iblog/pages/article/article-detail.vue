<template>
	<view class="container" v-if="Object.keys(article).length">
		<view class="thumb-up" @click="thumbUp()">
			<image class="thumb-up-icon" src="../../static/article/thumbUp.png" mode="aspectFill"></image>
			<text class="thumb-up-text">{{article.thumbUp}}</text>
		</view>
		<view class="title">
			<text class="title-text">{{article.title}}</text>
		</view>
		<view class="tip">
			<text class="tip-author">{{article.author}}</text>
			<text class="tip-time">{{article.createTime}}</text>
			<text class="tip-readNum">阅读：{{article.readNum}}</text>
		</view>
		<view class="article-content" v-if="content">
			<rich-text :nodes="content" style="font-size: 14px;"></rich-text>
		</view>
	</view>
</template>

<script>
	import htmlParser from '@/common/html-parser'
	
	function parseImgs(nodes) {
		nodes.forEach(node => {
			if (
				node.name === 'img' 
				//&& node.attrs 
				//&& node.attrs['data-img-size-val']
			) {
				//const sizes = node.attrs['data-img-size-val'].split(',');
				//console.log(node);
				//const width = uni.upx2px(720 * 0.9)
				//const height = parseInt(width * (sizes[1] / sizes[0]))
				//node.attrs.style = `width:${width};height:${height};`
				const width = uni.upx2px(690);
				node.attrs.style = `max-width:${width}px;`;
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
				article:{},
				content: null
			}
		},
		onLoad(option){
			this.id = option.id;
			this.articleRequest(option.id);
		},
		methods:{
			articleRequest(id){
				uni.request({
					url: uni.getStorageSync("baseUrl")+"/appApi/article/detail",
					method: "post",
					dataType: "json",
					data: {
						id: id
					},
					success: (data) => {
						this.article = data.data.article;
						const nodes = htmlParser(data.data.article.content);
						this.content = parseImgs(nodes);
						//nodes;
					}
				})
			},
			thumbUp(){
				uni.request({
					url: uni.getStorageSync("baseUrl")+"/appApi/article/thumbUp",
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
							this.article.thumbUp++;
						}
					}
				})
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
	.title{
		display: flex;
		flex-direction: column;
		padding: 0 0 20rpx;
	}
	.title-text{
		text-align: center;
	}
	.tip{
		display: flex;
		padding: 0 10rpx;
		flex-direction: row;
		justify-content: space-between;
	}
	.tip-author,
	.tip-time,
	.tip-readNum{
		font-size: 28rpx;
		color: #808080;
	}
	.article-content{
		padding: 20rpx 0;
	}
</style>
