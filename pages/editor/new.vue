<template>
    <div>
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
            submit() {
                
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