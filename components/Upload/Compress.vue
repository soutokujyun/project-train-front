<template>
  <div class="upload-file">
    <div ref="drag" class="drag">
      <i class="el-icon-plus avatar-uploader-icon"></i>
      <input
        ref="file"
        type="file"
        style="display: none"
        webkitdirectory
        @change="handleFileChange"
      />
    </div>
    <el-progress :stroke-width="20" :text-inside="true" :percentage="uploadProgress"></el-progress>
    <el-button style="margin-top: 10px" @click="uploadFile">上传</el-button>
  </div>
</template>

<script>
import JSZip from 'jszip'
export default {
  data() {
    return {
      files: [],
      uploadProgress: 0,
    };
  },
  mounted() {
    this.$refs.drag.addEventListener("click", (e) => {
      e.preventDefault();
      if (document.all) {
        this.$refs.file.click();
      } else {
        var event = document.createEvent("MouseEvent");
        event.initEvent("click", false, true);
        this.$refs.file.dispatchEvent(event);
      }
    });
  },
  methods: {
    generateZipFile(zipName, files, options = {type: "blob", compression: "DEFLATE"}) {
      return new Promise((resolve) => {
          const zip = new JSZip()
          for(let i = 0; i < files.length; i++) {
            zip.file(files[i].webkitRelativePath, files[i])
          }
          zip.generateAsync(options).then((blob) => {
            zipName = zipName || Date.now() + '.zip';
            const zipFile = new File([blob], zipName, {
              type: 'application/zip'
            });
            resolve(zipFile)
          })
      })
    },
    async uploadFile() {
      if (!this.files.length) return;
      // 获取压缩包信息
      let webkitRelativePath = this.files[0].webkitRelativePath;
      let zipFileName = webkitRelativePath.split("/")[0] + '.zip';
      // 打包
      let zipFile = await this.generateZipFile(zipFileName, this.files)
      const form = new FormData();
      form.append('file', zipFile)

      const ret = await this.$http.post('/upload/single', form, {
        onUploadProgress: progress => {
          this.uploadProgress = Number((( progress.loaded / progress.total ) * 100).toFixed(2))
        }
      })
    },
    handleFileChange(e) {
      const files = e.target.files;
      if (!files) return;
      this.files = Array.from(files);
    },
  },
};
</script>

<style lang="scss" scoped>
.upload-file {
  text-align: center;
  .drag {
    margin: 0 auto 5px;
    width: 178px;
    height: 178px;
    line-height: 178px;
    border: 2px dashed #eee;
    text-align: center;
    vertical-align: middle;
    cursor: pointer;
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    &:hover {
      border-color: #1e80ff;
    }
  }
}
</style>
