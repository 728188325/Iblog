<template>
    <div class="navbar">
        <el-menu
            :default-active="activeIndex"
            class="el-menu-demo"
            mode="horizontal"
            @select="navbarHandleSelect"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
        >
            <el-menu-item index="1">处理中心</el-menu-item>
            <el-submenu index="2">
                <template slot="title">我的工作台</template>
                <el-menu-item index="2-1">选项1</el-menu-item>
                <el-menu-item index="2-2">选项2</el-menu-item>
                <el-menu-item index="2-3">选项3</el-menu-item>
                <el-submenu index="2-4">
                    <template slot="title">选项4</template>
                    <el-menu-item index="2-4-1">选项1</el-menu-item>
                    <el-menu-item index="2-4-2">选项2</el-menu-item>
                    <el-menu-item index="2-4-3">选项3</el-menu-item>
                </el-submenu>
            </el-submenu>
            <el-menu-item index="3" disabled>消息中心</el-menu-item>
            <el-menu-item index="/platform/logout">
                <a href="javascript:;" @click="logout">退出后台</a>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script>
import axios from 'axios'
import Cookies from 'js-cookie'
export default {
    data () {
        return {
            activeIndex: ''
        }
    },
    methods: {
        navbarHandleSelect (key, keyPath) {
            // console.log(key, keyPath)
        },
        logout () {
            axios({
                method: 'post',
                url: '/platform/logout'
            }).then((res) => {
                if (res.data.status === 200) {
                    this.$message.error(res.data.msg)
                    Cookies.remove('iblogAdmin')
                    const baseUrl = process.env.NODE_ENV === 'production' ? window.location.origin : 'http://127.0.0.1:3002'
                    window.location.href = baseUrl + '/admin/login'
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.navbar {
    .el-menu {
        padding-left: 200px;
        li.el-menu-item:last-child {
            float: right;
        }
    }
}
</style>
