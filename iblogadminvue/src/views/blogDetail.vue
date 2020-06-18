<template>
    <div class="container">
        <el-page-header @back="goBack" content="文章详情"> </el-page-header>
        <div class="content">
            <h1 class="title">{{article.title}}</h1>
            <div class="tips">
                <span>作者：{{article.author}}</span>
                <span class="article-type">文章类型：{{ article.type===0?"经典文章":"生活随笔" }}</span>
                <span>发布时间：{{ article.createTime }}</span>
            </div>
            <div v-html="article.content"></div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    data () {
        return {
            article: {}
        }
    },
    mounted () {
        this.articleDetailQuery()
    },
    methods: {
        articleDetailQuery () {
            axios({
                method: 'post',
                url: '/platform/getArticleDetail',
                data: {
                    id: this.$route.params.id
                }
            }).then((res) => {
                if (res.data.status === 200) {
                    this.article = res.data.data
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        goBack () {
            this.$router.back()
        }
    }
}
</script>

<style lang="scss">
.title{
    margin-top: 20px;
    font-size: 26px;
    color: #d46565;
    text-align: center;
}
.tips{
    margin: 10px 0 30px;
    text-align: center;
    font-size: 14px;
    color: #cc7c7c;
}
.article-type{
    margin: 0 20px;
}
</style>
