<template>
    <el-upload
        class="upload-demo"
        drag
        action="http://127.0.0.1:3300/api/upload1"
        :show-file-list="false"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
    >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
            <div class="el-upload__tip">
                只能上传 jpg/png 文件，且不超过 500kb
            </div>
        </template>
    </el-upload>
</template>

<script>
import { defineComponent } from "vue";
import { ElMessage } from "element-plus";

export default defineComponent({
    name: "App",
    setup() {
        function handleSuccess(result) {
            if (result.status === 200) {
                ElMessage.success("上传成功");
            }
        }
        function beforeUpload(file) {
            // 格式校验
            const { type, size } = file;
            if (!/(png|gif|jpeg|jpg)/i.test(type)) {
                ElMessage.error("文件格式错误");
                return false;
            }
            if (size > 200 * 1024 * 1024) {
                ElMessage.error("文件大小错误");
                return false;
            }
            return true;
        }

        return {
            beforeUpload,
            handleSuccess,
        };
    },
});
</script>

<style>
</style>
