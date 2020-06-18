<template>
    <div class="container">
        <el-page-header @back="goBack" content="留言详情"></el-page-header>
        <div class="panel">
            <div class="detail">
                <div name="liContent">
                    <h2>{{ msg.createTime }}</h2>
                    <p v-html="msg.content"></p>
                </div>
                <div class="bottom clearfix">
                    <h3 class="fl">来自: {{ msg.from }}</h3>
                    <h4>
                        <span>点赞数：{{ msg.thumbUp }}</span>
                    </h4>
                </div>
            </div>
            <div class="site-text site-block" id="msgList">
                <div
                    class="comment-box"
                    v-for="(item, key) in msg.commentList"
                    :key="item._id"
                >
                    <div class="comment-fl">
                        {{ tsFormatter(item.commentTime) }}：{{ item.content }}
                    </div>
                    <div class="comment-fr">
                        <el-button
                            type="primary"
                            icon="el-icon-delete"
                            @click="delComent(item._id, key)"
                        ></el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
import axios from 'axios'
export default {
    data () {
        return {
            msg: {}
        }
    },
    mounted () {
        this.msgDetailQuery()
    },
    methods: {
        tsFormatter (data) {
            return moment(data).format('YYYY-MM-DD HH:mm:ss')
        },
        msgDetailQuery () {
            axios({
                method: 'post',
                url: '/platform/getMsgDetail',
                data: {
                    id: this.$route.params.id
                }
            }).then((res) => {
                if (res.data.status === 200) {
                    this.msg = res.data.data
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        goBack () {
            this.$router.back()
        },
        delComent (id, key) {
            axios({
                method: 'post',
                url: '/platform/msgCommentDelete',
                data: {
                    id: id
                }
            }).then((res) => {
                if (res.data.status === 200) {
                    this.msg.commentList.splice(key)
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        }
    }
}
</script>

<style lang="scss">
.detail {
    padding: 10px;
    margin: 25px 0 20px;
    background-color: #ffc;
}
.detail img {
    max-width: 100%;
}

.detail h2 {
    font-family: 'Eater', cursive;
    font-size: 14px;
    padding-bottom: 10px;
    padding-top: 5px;
}

.detail p {
    max-width: 100%;
    font-size: 14px;
    color: #656565;
    word-break: break-all;
    font-weight: 500;
}

.detail .bottom {
    padding-top: 10px;
}

.detail h3 {
    font-family: 'Eater', cursive;
    color: rgba(33, 33, 33, 0.7);
    width: 200px;
}

.detail h4 {
    text-align: right;
    z-index: 9999;
    font-size: medium;
    cursor: pointer;
}
.comment-box {
    position: relative;
    display: flex;
    margin-bottom: 10px;
    .comment-fl {
        flex: 1;
        padding-left: 10px;
        line-height: 40px;
        border-left: 5px solid #009688;
        background: #eee;
    }
    .comment-fr {
        width: 56px;
    }
}
</style>
