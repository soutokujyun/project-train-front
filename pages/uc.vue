<template>
    <div>
        <h1>用户中心</h1>
        <div ref="drag" id="drag">
            <input type="file" @change="handleFilerChange">
        </div>
        <div>
            <el-progress :stroke-width="20" :text-inside="true" :percentage="uploadProgress"></el-progress>
        </div>
        <div>
            <el-button @click="uploadFile">上传</el-button>
        </div>
        <div v-if="imgSrc">
            <img :src="imgSrc" width="100">
        </div>
    </div>
</template>
<style scoped>
#drag {
    width: 200px;
    height: 200px;
    line-height: 200px;
    border: 2px dashed #eee;
    text-align: center;
    vertical-align: middle; 
}
</style>

<script>
export default {
    data() {
        return {
            file: '',
            imgSrc: '',
            uploadProgress: 0
        }
    },
    async mounted () {
        const info = await this.$http.get('/user/info')
        console.log(info);
        this.bindEvents()
    },
    methods: {
        bindEvents() {
            const drag = this.$refs.drag
            drag.addEventListener('dragover', e=>{
                drag.style.borderColor = 'red';
                e.preventDefault()
            })
            drag.addEventListener('dragleave', e=>{
                drag.style.borderColor = '#eee';
                e.preventDefault()
            })
            drag.addEventListener('drop', e=>{
                const files = e.dataTransfer.files;
                this.file = files[0];
                drag.style.borderColor = '#eee';
                e.preventDefault()
            })
        },
        async uploadFile() {
            const form = new FormData();
            form.append('name', 'file')
            form.append('file', this.file)

            const ret = await this.$http.post('/uploadfile', form, {
                onUploadProgress: progress=>{
                    this.uploadProgress = Number((( progress.loaded / progress.total ) * 100).toFixed(2))
                }
            });
            console.log(ret);
            this.imgSrc = '/api' + ret.data.url;
        },
        handleFilerChange(e) {
            const [file] = e.target.files;
            console.log(file);
            if (!file) return  
            this.file = file;
        }
    },
}
</script>
