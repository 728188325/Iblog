<template>
    <div class="container">
        <div class="page-legend">
            <el-divider content-position="left">博客列表</el-divider>
        </div>
        <div class="list">
            <el-table
                :data="tableData"
                border
                stripe
                style="width: 100%"
                max-height="660"
            >
                <el-table-column
                    type="index"
                    :index="tableIndex"
                    width="50"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="title"
                    label="标题"
                    width="280"
                    :show-overflow-tooltip="true"
                >
                    <template slot-scope="scope">
                        <a
                            class="article-title"
                            href="javascript:;"
                            @click="skipDetail(scope.$index, scope.row)"
                            >{{ scope.row.title }}</a
                        >
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="文章类型" width="100">
                    <template slot-scope="scope">
                        <el-tag
                            :type="scope.row.type === 0 ? 'primary' : 'success'"
                            disable-transitions
                            >{{
                                scope.row.type === 0 ? '经典文章' : '生活随笔'
                            }}</el-tag
                        >
                    </template>
                </el-table-column>
                <el-table-column
                    prop="introduction"
                    label="简介"
                    :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column
                    prop="author"
                    label="作者"
                    width="130"
                ></el-table-column>
                <el-table-column
                    prop="createTime"
                    label="发布时间"
                    width="170"
                ></el-table-column>
                <el-table-column label="操作" width="146">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            @click="handleEdit(scope.$index, scope.row)"
                            >编辑</el-button
                        >
                        <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)"
                            >删除</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="paginate">
            <el-pagination
                background
                layout="prev, pager, next"
                :total="paginateTotal"
                @current-change="currentChange"
            >
            </el-pagination>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    data () {
        return {
            tableIndex: 1,
            paginateTotal: 20,
            page: 1,
            limit: 10,
            tableData: []
        }
    },
    mounted () {
        this.articleQuery()
    },
    methods: {
        articleQuery () {
            const url = '/platform/getArticles'
            axios({
                method: 'post',
                url: url,
                data: {
                    page: this.page,
                    limit: this.limit
                }
            }).then((res) => {
                if (res.data.status === 200) {
                    this.tableData = res.data.data
                    this.paginateTotal = res.data.count
                }
            })
        },
        handleEdit (index, row) {
            this.$router.push({
                name: 'blogAdd',
                params: { id: row._id }
            })
        },
        handleDelete (index, row) {
            this.$confirm('您是否删除该篇文章?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios({
                    method: 'post',
                    url: '/platform/articleDelete',
                    data: {
                        id: row._id
                    }
                }).then((res) => {
                    if (res.data.status === 200) {
                        this.currentChange()
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        })
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
        },
        currentChange (current) {
            this.page = current === undefined ? this.page : current
            this.tableIndex = (this.page - 1) * this.limit + 1
            this.articleQuery()
        },
        skipDetail (index, row) {
            this.$router.push({
                name: 'BlogDetail',
                params: {
                    id: row._id
                }
            })
        }
    },
    beforeRouteLeave (to, from, next) {
        from.meta.keepAlive = true // 让 列表页 即缓存，不刷新
        next()
    }
}
</script>

<style lang="scss">
.page-legend {
    .el-divider__text {
        font-size: 20px;
    }
}
.article-title {
    color: #607d8b;
}
.paginate {
    padding: 10px 0;
    .el-pagination {
        padding-right: 0;
        text-align: right;
    }
}
</style>
