<template>
    <div class="container">
        <el-page-header @back="goBack" :content="topic"></el-page-header>
        <div class="ipt-box ipt-st">
            <span class="ipt-dd">标题：</span>
            <el-input placeholder="请输入内容" v-model="title" clearable>
            </el-input>
        </div>
        <div class="ipt-box">
            <span class="ipt-dd">文章类型：</span>
            <el-select v-model="type" placeholder="请选择">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                >
                </el-option>
            </el-select>
        </div>
        <div class="ipt-box edit-content">
            <span class="ipt-dd">内容：</span>
            <quill-editor
                v-model="content"
                ref="myQuillEditor"
                :options="editorOption"
                @blur="onEditorBlur($event)"
                @focus="onEditorFocus($event)"
                @change="onEditorChange($event)"
                style="height: 350px;"
            >
            </quill-editor>
        </div>
        <div class="ipt-box">
            <span class="ipt-dd">缩略图：</span>
            <el-upload
                class="avatar-uploader"
                :action="uploadThumbnailApi"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
            >
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
        </div>
        <div class="btn">
            <el-button type="primary" round @click="articleHandleClick">
                {{ id ? '修改文章' : '发布文章' }}
            </el-button>
        </div>
        <!-- 上传文章图片 -->
        <el-upload
            class="pic-uploader"
            :action="uploadArticleImgApi"
            :show-file-list="false"
            :on-success="handleArticleImgSuccess"
            :before-upload="beforeArticleImgUpload"
        >
        </el-upload>
    </div>
</template>

<script>

import axios from 'axios'
import { mapState } from 'vuex'
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

export default {
    components: { quillEditor },
    data () {
        return {
            id: null,
            listRefresh: true, // 返回列表列表是否刷新
            uploadThumbnailApi: '/platform/uploadThumbnail', // 缩略图上传地址
            uploadArticleImgApi: '/platform/uploadArticleImg',
            topic: '文章发布',
            title: '',
            content: '',
            editorOption: {
                placeholder: '请在这里输入',
                modules: {
                    toolbar: {
                        container: [
                            ['bold', 'italic', 'underline', 'strike'], // 加粗，斜体，下划线，删除线
                            ['blockquote', 'code-block'], // 引用，代码块
                            [{ header: 1 }, { header: 2 }], // 标题，键值对的形式；1、2表示字体大小
                            [{ list: 'ordered' }, { list: 'bullet' }], // 列表
                            [{ script: 'sub' }, { script: 'super' }], // 上下标
                            [{ indent: '-1' }, { indent: '+1' }], // 缩进
                            [{ direction: 'rtl' }], // 文本方向
                            [{ size: ['small', false, 'large', 'huge'] }], // 字体大小
                            [{ header: [1, 2, 3, 4, 5, 6, false] }], // 几级标题
                            [{ color: [] }, { background: [] }], // 字体颜色，字体背景颜色
                            [{ font: [] }], // 字体
                            [{ align: [] }], // 对齐方式
                            ['clean'], // 清除字体样式
                            ['image'] // 上传图片、上传视频, 'video'
                        ],
                        handlers: {
                            image: function (value) {
                                if (value) {
                                    // 调用iview图片上传
                                    document.querySelector('.pic-uploader .el-upload__input').click()
                                } else {
                                    this.quill.format('image', false)
                                }
                            }
                        }
                    }
                }
            },
            options: [{
                value: 0,
                label: '经典文章'
            }, {
                value: 1,
                label: '生活随笔'
            }],
            type: 0,
            imageUrl: ''
        }
    },
    mounted () {
        if (this.$route.params.id) {
            this.id = this.$route.params.id
            this.getArticleDetail()
            this.topic = '文章修改'
        } else {
            this.topic = '文章发布'
        }
    },
    computed: {
        ...mapState(['userInfo']),
        editor () {
            return this.$refs.myQuillEditor.quill
        }
    },
    methods: {
        goBack () {
            this.listRefresh = false
            this.$router.back()
        },
        getArticleDetail () {
            axios({
                method: 'post',
                url: '/platform/getArticleDetail',
                data: {
                    id: this.id
                }
            }).then((res) => {
                if (res.data.status === 200) {
                    this.title = res.data.data.title
                    this.content = res.data.data.content
                    this.type = res.data.data.type
                    this.imageUrl = res.data.data.imgUrl
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        onEditorReady (editor) { // 准备编辑器

        },
        onEditorBlur () { }, // 失去焦点事件
        onEditorFocus () { }, // 获得焦点事件
        onEditorChange () { }, // 内容改变事件
        handleAvatarSuccess (res, file) {
            // this.imageUrl = URL.createObjectURL(file.raw) bold格式
            if (res.status === 200) {
                this.$message({
                    message: res.msg,
                    type: 'success'
                })
                this.imageUrl = res.data.src
            } else {
                this.$message.error(res.msg)
            }
        },
        beforeAvatarUpload (file) {
            const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png')
            const isLt2M = file.size / 1024 / 1024 < 2
            if (!isJPG) {
                this.$message.error('上传的缩略图只能是 JPG或PNG 格式!')
            }
            if (!isLt2M) {
                this.$message.error('上传缩略图大小不能超过 2MB!')
            }
            return isJPG && isLt2M
        },
        beforeArticleImgUpload (file) {
            const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif')
            const isLt2M = file.size / 1024 / 1024 < 5
            if (!isJPG) {
                this.$message.error('上传的缩略图只能是JPG、PNG或GIF格式!')
            }
            if (!isLt2M) {
                this.$message.error('上传缩略图大小不能超过 5MB!')
            }
            return isJPG && isLt2M
        },
        handleArticleImgSuccess (res, file) {
            // 获取富文本组件实例
            const quill = this.$refs.myQuillEditor.quill
            // 如果上传成功
            if (res) {
                // 获取光标所在位置
                const length = quill.getSelection().index
                // 插入图片，res为服务器返回的图片链接地址
                quill.insertEmbed(length, 'image', res.data.src)
                // 调整光标到最后
                quill.setSelection(length + 1)
            } else {
                // 提示信息
                this.$message.error('图片插入失败')
            }
        },
        articleHandleClick () {
            if (this.title.trim().length === 0) {
                this.$message.error('亲~请输入标题')
                return
            }
            if (this.content.trim().length === 0) {
                this.$message.error('亲~请编写内容')
                return
            }
            const txt = this.content.replace(/<\/?.+?>/g, '').replace(/ /g, '')
            const introduction = txt.substring(0, 135)
            const articleObj = {
                title: this.title, // 标题
                introduction: introduction, // 简介
                content: this.content, // 内容
                type: this.type,
                author: this.userInfo.nick, // 作者
                imgUrl: this.imageUrl // 缩略图
            }
            if (this.id) articleObj.id = this.id
            axios({
                method: 'post',
                url: '/platform/articlePublish',
                data: articleObj
            }).then((res) => {
                if (res.data.status === 200) {
                    this.$message({
                        message: res.data.msg,
                        type: 'success'
                    })
                    this.listRefresh = true
                    this.$router.push({
                        path: '/blogList'
                    })
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        }
    },
    beforeRouteLeave (to, from, next) {
        // 导航离开该组件的对应路由时调用
        // 可以访问组件实例 `this`
        if (to.path === '/blogList' && this.listRefresh) {
            to.meta.keepAlive = false // 让 列表页 即不缓存，刷新
        }
        next()
    }
}
</script>

<style lang="scss">
/* .container {
    max-width: 1000px;
} */
.ipt-box {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    &.ipt-st {
        margin-top: 30px;
    }
    .ipt-dd {
        display: inline-block;
        width: 100px;
        text-align: justify;
        text-align-last: justify;
    }
    .el-input {
        flex: 1;
    }
    .el-select {
        flex: 1;
    }
    .quill-editor {
        flex: 1;
    }
}
.quill-editor {
    display: flex;
    flex-direction: column;
}
.ql-container {
    flex: 1;
    height: auto !important;
    overflow: auto;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 150px;
    line-height: 150px !important;
    text-align: center;
}
.avatar {
    width: 150px;
    height: 150px;
    display: block;
}
.btn {
    padding: 20px 0 0 100px;
}
.ivu-upload {
    display: none;
}
</style>
