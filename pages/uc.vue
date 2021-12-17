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
        async blobToString(blob) {
            return new Promise(resolve=>{
                const reader = new FileReader();
                reader.onload = function(){
                    const ret = reader.result.split('')
                                .map(v=>v.charCodeAt())
                                .map(v=>v.toString(16).toUpperCase())
                                .map(v=>v.padStart(2, '0'))
                                .join(' ')
                    resolve(ret)
                }
                reader.readAsBinaryString(blob);
            })
        },
        async isGif(file) {
            // 前面6个16进制: GIF89a 和 GIF87a
            // 前面6个16进制："47 49 46 38 39 61" "47 49 46 38 37 61"
            // 后4位是gif图的宽高 blob = file.slice(7, 11) width:blob[0] height:blob[3]
            // 16进制的转换
            const ret = await this.blobToString(file.slice(0, 6));
            return (ret == '47 49 46 38 39 61') || (ret == '47 49 46 38 37 61');
        },
        async isPng(file) {
            const ret = await this.blobToString(file.slice(0, 8));
            console.log(ret);
            return ret == '89 50 4E 47 0D 0A 1A 0A';
        },
        async isJpg(file) {
            const start = await this.blobToString(file.slice(0, 2)); // FF D8
            const tail = await this.blobToString(file.slice(-2)); // FF D9
            return start == 'FF D8' && tail == 'FF D9';
        },
        async isImage(file) {
            // 通过文件流来判断
            // 判断GIF
            return await this.isGif(file) || await this.isPng(file) || await this.isJpg(file)
        },
        async uploadFile() {
            if (!await this.isImage(this.file)) {
                console.log("文件不是图片")
                return
            } else {
                console.log("文件是图片")
            }
            const form = new FormData();
            form.append('name', 'file')
            form.append('file', this.file)

            const ret = await this.$http.post('/uploadfile', form, {
                onUploadProgress: progress=>{
                    this.uploadProgress = Number((( progress.loaded / progress.total ) * 100).toFixed(2))
                }
            });
            this.imgSrc = '/api' + ret.data.url;
        },
        handleFilerChange(e) {
            const [file] = e.target.files;
            if (!file) return  
            this.file = file;
        }
    },
}
</script>
