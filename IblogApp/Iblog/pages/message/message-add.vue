<template>
	<view>
		<jinEdit placeholder="请输入内容" @editOk="editOk" :uploadFileUrl="uploadFileUrl"></jinEdit> 
	</view>
</template>

<script>
	import jinEdit from '../../components/jin-edit/jin-edit.vue';
	export default {
		data() {
			return {
				uploadFileUrl: uni.getStorageSync("baseUrl")+"/appApi/word/uploadImg"
			}
		},
		components: {
			jinEdit
		},
		onLoad(){
			
		},
		methods: {
			// 点击发布
			editOk(res) {
				uni.request({
					url: uni.getStorageSync("baseUrl")+"/appApi/word/publish",
					method: "post",
					dataType: "json",
					data:{
						content: res.html,
						from: "APP端"
					},
					success: (data) => {
						if(data.data.status==200){
							uni.showToast({
								icon: "none",
							    title: data.data.msg,
							    duration: 2000
							});
							setTimeout(() => {
								uni.navigateBack({
									animationType: 'pop-out',
									animationDuration: 200
								});
							},2000)
						}
					}
				})
			}
		}
	}
</script>

<style>

</style>
