<template>
    <div>
        <!-- <div contenteditable="true"></div>
        document.execCommond('') -->
        <!-- 1. 刚开始使用第三方 tinyMce, wangEditor
        2. 开源的定制的 slate.js
        3. 有专门的编辑器开发团队，自己定制，非常复杂，word在线版
        计算位置，定位，样式，实现一个简单的浏览器工作量差不多 -->
        <div class="write-btn">
            <el-button @click="submit" type="primary">提交</el-button>
        </div>
        <el-row>
            <el-col :span="12">
                <!-- markdown编辑器的基本操作 -->
                <textarea ref="editor" class="md-editor" :value="content" @input="update" ></textarea>
            </el-col>
            <el-col :span="12">
                <div class="markdown-body" v-html="compiledContent"></div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import { marked } from 'marked'
    import hljs from 'highlight.js/lib/core';
    import javascript from 'highlight.js/lib/languages/javascript';
    hljs.registerLanguage('javascript', javascript);
    import 'highlight.js/styles/github.css';
    export default {
        data() {
            return {
                content: `# 斗鱼直播
* 上课
* 看视频
* 游戏
\`\`\`javascript
    let a = 1
    console.log(a)
\`\`\`
                `
            }
        },
        mounted () {
            this.timer = null;
            this.bindEvents()

            marked.setOptions({
                rendered: new marked.Renderer(),
                highlight: function(code) {
                    return hljs.highlightAuto(code).value
                }
            })
        },
        computed: {
            compiledContent() {
                return marked(this.content)
            }
        },
        methods: {
            bindEvents() {
                this.$refs.editor.addEventListener('paste', async e => {
                    const files = e.clipboardData.files
                    console.log(e);
                    // todo 文件上传
                })
                this.$refs.editor.addEventListener('drop', async e => {
                    const files = e.dataTransfer.files
                    console.log(e);
                    
                    e.preventDefault()
                    // todo 文件上传
                })
            },
            async submit() {
                // 文章列表-虚拟列表， 点赞，关注，草稿
                let ret = await this.$http.post('/article/create', {
                    content: this.content, // selected： false
                    compiledContent: this.compiledContent // 读取的时候默认只显示这个
                })
            },
            update(e) {
                clearTimeout(this.timer)
                this.timer = setTimeout(() => {
                    this.content = e.target.value
                }, 350)
            }
        },
    }
</script>

<style scoped>
.md-editor {
    width: 100%;
    height: 100vh;
    outline: none;
}
.write-btn {
    position: fixed;
    z-index: 100;
    right: 30px;
    top: 10px;
}
</style>