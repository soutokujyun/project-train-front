<template>
    <div>
        <h1>用户中心</h1>
        <div ref="drag" id="drag">
            <input type="file" @change="handleFilerChange">
        </div>
        <div>
            <!-- <el-progress :stroke-width="20" :text-inside="true" :percentage="uploadProgress"></el-progress> -->
        </div>
        <div>
            <el-button @click="uploadFile">上传</el-button>
        </div>
        <h2>计算hash值</h2>
        <div>
            <el-progress :stroke-width="20" :text-inside="true" :percentage="hashProgress"></el-progress>
        </div>
        <div>
            <!-- chunks.progress
            progress < 0 报错显示红色
            == 100 成功
            别的数字 方块高度显示 -->
            <!-- 尽可能让方块看起来是正方形
            比如10个方块 4 * 4
            9 3 * 3
            100 10 * 10 -->
            <div class="cube-container" :style="{width: cubeWidth + 'px'}">
                <div class="cube" v-for="chunk in chunks" :key="chunk.name">
                    <div 
                        :class="{
                            'uploading': chunk.progress > 0  && chunk.progress < 100,
                            'success': chunk.progress == 100,
                            'error': chunk.progress < 0
                        }"
                        :style="{height: chunk.progress+'%'}"    
                    >
                        <i class="el-icon-loading" style="color: #f56c6c" v-if="chunk.progress < 100 && chunk.progress > 0"></i>    
                    </div>
                </div>
            </div>
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
.cube-container {

}
.cube-container .cube{
    width: 14px;
    height: 14px;
    line-height: 12px;
    border: 1px solid black;
    background: #eee;
    float: left;
}
.cube-container .cube > .success {
    background: green;
}
.cube-container .cube > .uploading {
    background: blue;
}
.cube-container .cube > .error {
    background: red;
}
</style>

<script>
const CHUNK_SIZE = 0.1 * 1024 * 1024;
import sparkMD5 from "spark-md5"
export default {
    data() {
        return {
            file: '',
            imgSrc: '',
            // uploadProgress: 0,
            hashProgress: 0,
            chunks: []
        }
    },
    computed: {
        cubeWidth() {
            return Math.ceil(Math.sqrt(this.chunks.length)) * 16
        },
        uploadProgress(){
            if (!this.file && this.chunks.length) {
                return 0
            } 
            const loaded = this.chunks.map(item => item.chunks.size * item.progress)
                                    .reduce((acc, cur) => acc + cur, 0)
            return Number(((loaded * 100) / this.file.size).toFixed(2))
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
        createFileChunk(file, size = CHUNK_SIZE) {
            const chunks = [];
            let cur = 0
            while(cur < file.size) {
                chunks.push({index: cur, file: file.slice(cur, cur + size)})
                cur += size
            }
            return chunks
        },
        async calculateHashWork() {
            return new Promise(resolve=>{
                this.worker = new Worker('/hash.js');
                this.worker.postMessage({chunks: this.chunks})
                this.worker.onmessage = e => {
                    const {progress, hash} = e.data
                    this.hashProgress = Number(progress.toFixed(2))
                    if (hash) {
                        resolve(hash)
                    }
                }
            })
        },
        async calculateHashIdel() {
            const chunks = this.chunks
            return new Promise(resolve=>{
                const spark = new sparkMD5.ArrayBuffer()
                let count = 0
                const appendToSpark = async file => {
                    return new Promise(resolve => {
                        const reader = new FileReader()
                        reader.readAsArrayBuffer(file)
                        reader.onload = e => {
                            spark.append(e.target.result)
                            resolve()
                        }
                    })
                }
                const workLoop = async deadline =>{
                    while(count<chunks.length && deadline.timeRemaining() > 1) {
                        // 空闲时间，有任务
                        await appendToSpark(chunks[count].file)
                        count++
                        if (count < chunks.length) {
                            this.hashProgress = Number((100*count/chunks.length).toFixed(2))
                        } else {
                            this.hashProgress = 100
                            resolve(spark.end())
                        }

                    }
                    window.requestIdleCallback(workLoop)
                }

                window.requestIdleCallback(workLoop)
            })
        },
        async calculateHashSample() {
            // 布隆过滤器，牺牲精准度，判断文件是否存在
            // 1G文件，抽样后5M以内
            // hash一样，文件不一定一样
            // hash不一样，文件一点不一样
            return new Promise(resolve => {
                const spark = new sparkMD5.ArrayBuffer()
                const reader = new FileReader()
                const file = this.file
                const size = file.size

                const offset = 2 * 1024 * 1024
                // 首2M 中间每M取首中尾各2个字节 尾2M
                let chunks = [file.slice(0, offset)]
                let cur = offset;
                while (cur < size) {
                    if (cur+offset >= size) {
                        // 最后一个区块
                        chunks.push(file.slice(cur, cur+offset))
                    } else {
                        // 中间区块
                        const mid = (cur+offset) >> 1
                        const end = cur + offset
                        chunks.push(file.slice(cur, cur+2))
                        chunks.push(file.slice(mid, mid+2))
                        chunks.push(file.slice(end - 2, end))
                    }
                    cur += offset
                }
                reader.readAsArrayBuffer(new Blob(chunks))
                reader.onload = e => {
                    spark.append(e.target.result)
                    this.hashProgress = 100
                    resolve(spark.end())
                }
            })
        },
        async uploadFile() {
            // if (!await this.isImage(this.file)) {
            //     console.log("文件不是图片")
            //     return
            // } else {
            //     console.log("文件是图片")
            // }

            // this.chunks = this.createFileChunk(this.file)
            // const hash = await this.calculateHashWork()
            // const hash1 = await this.calculateHashIdel()
            // console.log('文件hash', hash);
            // console.log('文件hash', hash1);
            // const form = new FormData();
            // form.append('name', 'file')
            // form.append('file', this.file)

            // const ret = await this.$http.post('/uploadfile', form, {
            //     onUploadProgress: progress=>{
            //         this.uploadProgress = Number((( progress.loaded / progress.total ) * 100).toFixed(2))
            //     }
            // });
            // this.imgSrc = '/api' + ret.data.url;

            // 推荐：抽样hash 不算全量 ： 大文件优化方案： 首2M 中间每M取首中尾各2个字节 尾2M
            const chunks = this.createFileChunk(this.file)
            const hash = await this.calculateHashSample()
            this.chunks = chunks.map((chunk, index) => {
                // 切片名字 hash + index
                const name = hash + '-' + index
                return {
                    hash,
                    name,
                    index,
                    chunk: chunk.file,
                    progress: 0
                }
            })
            await this.uploadChunks()
            
        },
        async uploadChunks() {

            const requests = this.chunks.map((chunk, index) => {
                const form = new FormData()
                form.append('chunk', chunk.chunk)
                form.append('name', chunk.name)
                form.append('hash', chunk.hash)
                // form.append('index', chunk.index)
                return form
            }).map((form, index) => this.$http.post('/uploadfile', form, {
                onUploadProgress: progress=>{
                    // 不是整体的进度条，每个区块有自己的进度条
                    this.chunks[index].progress = Number((( progress.loaded / progress.total ) * 100).toFixed(2))
                }
            }))
            // @todo 并发数量控制
            await Promise.all(requests)

        },
        handleFilerChange(e) {
            const [file] = e.target.files;
            if (!file) return  
            this.file = file;
        }
    },
}
</script>
