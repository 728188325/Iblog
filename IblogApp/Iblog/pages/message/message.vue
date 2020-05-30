<template>
	<view>
		<view class="add" @click="naviateToAddMsg()">
			<image class="add-icon" src="../../static/message/add.png" mode="aspectFill"></image>
		</view>
		<view class="banner">
			<image class="pic" src="../../static/message/logo.jpg" mode="aspectFit"></image>
		</view>
		<!-- 留言列表 -->
		<scroll-view class="article" :scroll-top="scrollTop" scroll-y="true"
		 @scrolltolower="lower"
		 @scroll="scroll"
		 :style="{height:scrollHeight}">
			<view class="list" v-for="item in messages" :key="item._id"
			 @click="navigateToDetail(item._id)">
				<view class="list-content">
					<rich-text :nodes="item.content" style="font-size: 14px;"></rich-text>
					<view class="tip">
						<text class="from">来自：{{item.from}}</text>
						<text class="thumbUp">点赞:{{item.thumbUp}}&nbsp;&nbsp;&nbsp;评论:{{item.commentNum}}</text>
						<text class="date">{{item.createTime}}</text>
					</view>
				</view>
			</view>
			<view class="list-loading" v-if="isShowLoadingText">
				<text class="list-loading-text">{{listLoadingText}}</text>
			</view>
		</scroll-view>
		<!-- <list class="article" :style="{height:scrollHeight}"
		 loadmoreoffset="20" @loadmore="lower" scrollable="true">
			<cell class="list" v-for="item in messages" :key="item._id"
			 @click="navigateToDetail(item._id)">
				<view class="list-content">
					<rich-text :nodes="item.content" style="font-size: 14px;"></rich-text>
					<view class="tip">
						<text class="from">来自：{{item.from}}</text>
						<text class="thumbUp">点赞:{{item.thumbUp}}&nbsp;&nbsp;&nbsp;评论:{{item.commentNum}}</text>
						<text class="date">{{item.createTime}}</text>
					</view>
				</view>
			</cell>
			<cell class="list-loading" v-if="isShowLoadingText">
				<text class="list-loading-text">{{listLoadingText}}</text>
			</cell>
		</list> -->
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
				scrollTop: 0,
				old: {
					scrollTop: 0
				},
				scrollHeight: "500rpx",
				isLoading: false,//是否正在加载中
				isloadedAll: false,//是否已经全部加载完毕了
				currentPage: 1,
				limit: 8,
				isShowLoadingText: true,
				listLoadingText: "正在加载中...",
				messages: []
			}
		},
		beforeMount(){
			//动态计算文章列表高度
			uni.getSystemInfo({
			    success: (res)=> {
					//屏幕高度-slide轮播图高度-nav高度-底部选项卡高度
					let calcHeight;
					// #ifdef H5
					calcHeight = res.windowHeight - uni.upx2px(350);
					// #endif
					// #ifndef H5
					calcHeight = res.screenHeight - uni.upx2px(350) - 50;
					// #endif
					this.scrollHeight = calcHeight + "px";
			    }
			});
		},
		onShow(){
			this.messages = [];
			this.currentPage = 1;
			this.isShowLoadingText = true;
			this.listLoadingText = "正在加载中...";
			this.isloadedAll = false;
			this.getMessages(this.currentPage,this.limit);
		},
		async onPullDownRefresh() {
			this.listLoadingText = "正在加载中...";
			this.messages = [];
			this.currentPage = 1;
			this.isloadedAll = false;
			this.isLoading = false;
			await this.getMessages(this.currentPage,this.limit);
			uni.stopPullDownRefresh();
		},
		methods:{
			getMessages(page,limit){
				uni.request({
					url: uni.getStorageSync("baseUrl")+"/appApi/word/getList",
					method: "post",
					dataType: "json",
					 data:{
						page: page,
						limit: limit
					},
					success: (data) => {
						this.isLoading = false;
						//const nodes = htmlParser(data.data.article.content);
						//this.content = parseImgs(nodes);
						data.data.data.map((item,index) => {
							item.content = htmlParser(item.content);
							item.content = parseImgs(item.content);
						})
						this.messages = [...this.messages,...data.data.data];
						if(this.currentPage*this.limit>=data.data.count){
							this.isShowLoadingText = true;
							this.listLoadingText = "已全部加载完成~";
							this.isloadedAll = true;
						}else{
							this.isShowLoadingText = false;
						}
					}
				})
			},
			lower: function(e) {
				this.getMoreMessages();
			},
			scroll: function(e) {
				this.old.scrollTop = e.detail.scrollTop
			},
			getMoreMessages(){
				if(this.isloadedAll) return;
				if(this.isLoading) return;
				this.isLoading = true;
				this.isShowLoadingText = true;
				this.listLoadingText = "正在加载中...";
				this.currentPage++;
				this.getMessages(this.currentPage,this.limit);
			},
			navigateToDetail(id){
				uni.navigateTo({
					url: '/pages/message/message-detail?id='+id,
					animationType: 'pop-in',
					animationDuration: 200
				});
			},
			naviateToAddMsg(){
				uni.navigateTo({
					url: '/pages/message/message-add',
					animationType: 'pop-in',
					animationDuration: 200
				});
			}
		}
	}
</script>

<style scoped>
	.add{
		position: fixed;
		bottom: 140rpx;
		right: 60rpx;
		width: 150rpx;
		height: 150rpx;
		border-radius: 150rpx;
		z-index: 9;
		align-items: center;
		justify-content: center;
	}
	.add-icon{
		width: 150rpx;
		height: 150rpx;
		margin-bottom: 6rpx;
	}
	.banner{
		display: flex;
		flex-direction: column;
		width: 750rpx;
		height: 350rpx;
		padding: 20rpx;
		border-bottom-width: 5px;
		border-bottom-style: solid;
		border-bottom-color: #F44336;
		box-sizing: border-box;
	}
	.pic{
		flex: 1;
		flex-direction: column;
		width: 710rpx;
		height: 450rpx;
	}
	.list{
		display: flex;
		flex-direction: column;
		padding: 0 30rpx 0;
		box-sizing: border-box;
	}
	.list-content{
		padding: 30rpx 0;
		border-bottom-style: solid;
		border-bottom-width: 1rpx;
		border-bottom-color: #ccc;
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
	.list-loading{
		padding: 30rpx;
		text-align: center;
		line-height: 28rpx;
	}
	.list-loading-text{
		font-size: 28rpx;
		color: #555;
	}
</style>
