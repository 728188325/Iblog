import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        defaultSidebarIndex: '/blogList', // 初始化默认的菜单节点
        userInfo: null // 登录的管理员信息
    },
    getters: {},
    mutations: {
        setDefaultSidebarMutation (state, data) {
            state.defaultSidebarIndex = data
        },
        setUserInfoMutation (state, data) {
            state.userInfo = data
        }
    },
    actions: {
        setDefaultSidebarAction (store, data) {
            store.commit('setDefaultSidebarMutation', data)
        },
        setUserInfoAction (store, data) {
            store.commit('setUserInfoMutation', data)
        }
    },
    modules: {
    }
})
