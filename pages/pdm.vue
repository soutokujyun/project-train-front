<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>单文件上传</span>
          </div>
          <SingleUpload />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>多文件上传</span>
          </div>
          <MultipleUpload />
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 10px">
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>文件夹上传</span>
          </div>
          <DirectoryUpload />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>压缩目录上传</span>
          </div>
          <CompressUpload />
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 10px">
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>文件（夹）拖拽上传</span>
          </div>
          <DragUpload />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>剪切板上传</span>
          </div>
          <ClipboardUpload />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import SingleUpload from "~/components/Upload/Single.vue";
import MultipleUpload from "~/components/Upload/Multiple.vue";
import DirectoryUpload from "~/components/Upload/Directory.vue";
import CompressUpload from "~/components/Upload/Compress.vue";
import DragUpload from "~/components/Upload/Drag.vue";
import ClipboardUpload from "~/components/Upload/Clipboard.vue";
export default {
  components: {
    SingleUpload,
    MultipleUpload,
    DirectoryUpload,
    CompressUpload,
    DragUpload,
    ClipboardUpload,
  },
};
</script>

<style lang="scss" scoped></style>
