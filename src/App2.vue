<template>
    <el-upload
        class="upload-demo"
        drag
        action
        :auto-upload="false"
        :show-file-list="false"
        :on-change="changeFile"
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
import axios from "axios";
import qs from "qs";
import { fileParse } from "./util";

export default defineComponent({
    name: "App",
    setup() {
        async function changeFile(file) {
            if (!file) {
                return;
            }
            file = file.raw;
            const result = await fileParse(file);
            const res = await axios.post(
                "/api/upload2",
                qs.stringify({
                    chunk: encodeURIComponent(result),
                    filename: file.name,
                }),
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            );
            if (res.status === 200) {
                ElMessage.success("上传成功");
            }
        }

        return {
            changeFile,
        };
    },
});
</script>

<style>
</style>
