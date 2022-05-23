<template>
  <div class="upload-file">
    <div ref="drag" class="drag">
      <i class="el-icon-plus avatar-uploader-icon"></i>
      <input
        ref="file"
        type="file"
        style="display: none"
        multiple
        @change="handleFileChange"
      />
    </div>
    <el-progress
      :stroke-width="20"
      :text-inside="true"
      :percentage="uploadProgress"
    ></el-progress>
    <el-button style="margin-top: 10px" @click="uploadFile">上传</el-button>
  </div>
</template>

<script>
const IMAGE_MIME_REGEX = /^image\/(jpe?g|gif|png)$/i;
export default {
  data() {
    return {
      files: [],
      uploadProgress: 0,
    };
  },
  mounted() {
    this.bindEvents();
  },
  methods: {
    bindEvents() {
      const self = this;
      const drag = this.$refs.drag;
      drag.addEventListener("paste", (e) => {
        e.preventDefault();
        // const result = await navigator.permissions.query({
        //   name: "clipboard-read",
        // });
        // 无法使用 navigator.clipboard
        // if (navigator.clipboard && (result.state == 'granted' || result.state == 'prompt')) {
        //   const clipboardItems = await navigator.clipboard.read();
        //   for (const clipboardItem of clipboardItems) {
        //     for (const type of clipboardItem.types) {
        //       if (IMAGE_MIME_REGEX.test(type)) {
        //         const blob = await clipboardItem.getType(type);
        //         self.files.push(blob);
        //       }
        //     }
        //   }
        // } else {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
          if (IMAGE_MIME_REGEX.test(items[i].type)) {
            const file = items[i].getAsFile();
            self.files.push(file);
          }
        }
        // }
      });
    },

    async uploadFile() {
      if (!this.files.length) return;
      const form = new FormData();
      this.files.forEach((file) => {
        form.append(
          "file",
          file
        );
      });

      const ret = await this.$http.post("/upload/multiple", form, {
        onUploadProgress: (progress) => {
          this.uploadProgress = Number(
            ((progress.loaded / progress.total) * 100).toFixed(2)
          );
        },
      });
      console.log(ret);
      // this.imgSrc = '/api' + ret.data.url
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
