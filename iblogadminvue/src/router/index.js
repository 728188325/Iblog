import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/index'
import axios from 'axios'
import Cookies from 'js-cookie'

import BlogList from '@/views/blogList.vue'
import BlogDetail from '@/views/blogDetail'
import BlogAdd from '@/views/blogAdd'
import MsgList from '@/views/msgList'
import MsgDetail from '@/views/msgDetail'

Vue.use(VueRouter)

const routes = [{
    path: '/blogList',
    component: BlogList,
    meta: {
        keepAlive: true // 是否需要被缓存
    }
}, {
    path: '/blogDetail/:id',
    name: 'BlogDetail',
    component: BlogDetail
}, {
    path: '/blogAdd',
    name: 'blogAdd',
    component: BlogAdd
}, {
    path: '/msgList',
    component: MsgList
}, {
    path: '/msgDetail',
    name: 'MsgDetail',
    component: MsgDetail
}, {
    path: '*',
    redirect: '/blogList'
}]

const router = new VueRouter({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes
})

// 全局路由拦截
router.beforeEach((to, from, next) => {
    // console.log(to.path, from.path, '全局路由守卫')
    // 判断是否需要缓存
    /* if (to.path === '/blogList' && from.path.indexOf('/blogDetail') !== -1) {
        to.meta.keepAlive = true // 让 列表页 缓存，即不刷新
    } else {
        to.meta.keepAlive = false // 让 列表页 即不缓存，刷新
    } */
    // 检测是否已经登录，没有登录跳转到登录页面
    if (Cookies.get('iblogAdmin')) {
        // 重置cookie保存时间
        Cookies.set('iblogAdmin', true, {
            expires: 60 * 30 / (24 * 60 * 60) // 保存30分钟
        })
        store.dispatch('setDefaultSidebarAction', to.path)
        next()
    }
    axios({
        method: 'post',
        url: '/platform/checkLogin'
    }).then((res) => {
        if (res.data.status === 200) {
            store.dispatch('setDefaultSidebarAction', to.path)
            store.dispatch('setUserInfoAction', res.data.userInfo)
            // 保存cookie
            Cookies.set('iblogAdmin', true, {
                expires: 60 * 30 / (24 * 60 * 60) // 保存30分钟
            })
            next()
        } else {
            const baseUrl = process.env.NODE_ENV === 'production' ? window.location.origin : 'http://127.0.0.1:3002'
            window.location.href = baseUrl + '/admin/login'
        }
    })
})

export default router
