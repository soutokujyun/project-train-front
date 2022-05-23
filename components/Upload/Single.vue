<template>
  <div class="upload-file">
    <div ref="drag" class="drag">
      <i class="el-icon-plus avatar-uploader-icon"></i>
      <input
        ref="file"
        type="file"
        style="display: none"
        @change="handleFileChange"
      />
    </div>
    <el-progress :stroke-width="20" :text-inside="true" :percentage="uploadProgress"></el-progress>
    <el-button style="margin-top: 10px" @click="uploadFile">上传</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      file: "",
      imgSrc: "",
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
    async uploadFile() {
      if (!this.file) return;
      const form = new FormData();
      form.append('name', 'file')
      form.append('file', this.file)

      const ret = await this.$http.post('/upload/single', form, {
        onUploadProgress: progress => {
          this.uploadProgress = Number((( progress.loaded / progress.total ) * 100).toFixed(2))
        }
      })

      this.imgSrc = '/api' + ret.data.url
    },
    handleFileChange(e) {
      const [file] = e.target.files;
      if (!file) return;
      this.file = file;
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
