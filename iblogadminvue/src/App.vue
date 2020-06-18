<template>
    <div id="container">
        <Navbar></Navbar>
        <Sidebar></Sidebar>
        <keep-alive>
            <router-view class="main" v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view class="main" v-if="!$route.meta.keepAlive"></router-view>
    </div>
</template>

<script>
import Navbar from '@/components/navbar'
import Sidebar from '@/components/sidebar'
export default {
    components: { Navbar, Sidebar },
    data () {
        return {

        }
    },
    methods: {

    }
}
</script>

<style lang="scss">
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
html,
body {
    width: 100%;
    height: 100%;
}
body {
    position: relative;
    // font-family: Avenir, Helvetica, Arial, sans-serif;
    font: 14px Helvetica Neue, Helvetica, PingFang SC, Tahoma, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}
#container {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
}

.main {
    position: absolute;
    top: 61px;
    left: 200px;
    bottom: 0;
    right: 0;
    background: #fff;
    padding: 20px;
    overflow: auto;
}
</style>
