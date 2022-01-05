<template>
    <div>
        <div class="write-btn">
            <el-button @click="submit" type="primary">提交</el-button>
        </div>
        <el-row>
            <el-col :span="12">
                <!-- markdown编辑器的基本操作 -->
                <textarea class="md-editor" :value="content" @input="update" ></textarea>
            </el-col>
            <el-col :span="12">
                <div class="markdown-body" v-html="compiledContent"></div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {marked} from 'marked'
    export default {
        data() {
            return {
                content: `# 斗鱼直播
                * 上课
                * 看视频
                * 游戏`
            }
        },
        mounted () {
            this.timer = null;
        },
        computed: {
            compiledContent() {
                return marked(this.content)
            }
        },
        methods: {
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