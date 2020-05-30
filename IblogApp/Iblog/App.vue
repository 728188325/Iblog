<script>
	export default {
		onLaunch: function() {
			// #ifndef H5
			uni.setStorageSync('baseUrl', "http://39.107.61.146:3001");
			// #endif
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */

</style>
