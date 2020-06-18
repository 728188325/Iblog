<template>
    <div class="sidebar">
        <el-menu
            :default-active="defaultSidebarIndex"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            @select="sidevarHandleSelect"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
        >
            <h1 class="topic">Iblog管理系统</h1>
            <el-submenu index="1">
                <template slot="title">
                    <i class="el-icon-document"></i>
                    <span>博文管理</span>
                </template>
                <el-menu-item index="/blogList">博文列表</el-menu-item>
                <el-menu-item index="/blogAdd">博文发布</el-menu-item>
            </el-submenu>
            <el-menu-item index="/msgList">
                <i class="el-icon-menu"></i>
                <span slot="title">留言板管理</span>
            </el-menu-item>
            <el-menu-item index="3" disabled>
                <i class="el-icon-setting"></i>
                <span slot="title">系统设置</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    data () {
        return {
            // 初始化默认菜单节点
            // defaultSidebarIndex: '/blogList'
        }
    },
    computed: {
        ...mapState(['defaultSidebarIndex'])
    },
    methods: {
        sidevarHandleSelect (key, keyPath) {
            // console.log(key, keyPath)
            if (this.$router.history.current.fullPath === key) return
            this.$router.push(key)
        },
        handleOpen (key, keyPath) {
            // console.log(key, keyPath, '展开')
        },
        handleClose (key, keyPath) {
            // console.log(key, keyPath, '收起')
        }
    }
}
</script>

<style lang="scss" scoped>
.sidebar {
    position: absolute;
    top: 0;
    left: 0;
    width: 200px;
    height: 100%;
    z-index: 9;
    .el-menu {
        width: 200px;
        height: 100%;
        border-right: none;
        .topic {
            display: inline-block;
            height: 60px;
            line-height: 60px;
            font-size: 22px;
            color: #8bc34a;
            padding-left: 25px;
        }
    }
}
</style>
