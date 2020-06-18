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
                    prop="content"
                    label="内容"
                    :show-overflow-tooltip="true"
                >
                    <template slot-scope="scope">
                        <a
                            class="article-title"
                            href="javascript:;"
                            @click="skipDetail(scope.$index, scope.row)"
                            >{{ scope.row.content }}</a
                        >
                    </template>
                </el-table-column>
                <el-table-column prop="from" label="来自" width="150"></el-table-column>
                <el-table-column
                    prop="createTime"
                    label="留言时间"
                    width="170"
                ></el-table-column>
                <el-table-column
                    prop="thumbUp"
                    label="点赞数"
                    width="70"
                ></el-table-column>
                <el-table-column label="操作" width="146">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            @click="skipDetail(scope.$index, scope.row)"
                            >查看</el-button
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
            const url = '/platform/getMsgList'
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
        handleDelete (index, row) {
            this.$confirm('您是否删除该条留言?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios({
                    method: 'post',
                    url: '/platform/msgDelete',
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
                name: 'MsgDetail',
                params: {
                    id: row._id
                }
            })
        }
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
