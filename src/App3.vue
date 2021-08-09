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
    <br />
    <div class="progress">
        <el-progress
            :text-inside="true"
            :stroke-width="24"
            :percentage="total"
            status="success"
        ></el-progress>
        <el-button
            :type="abort ? 'success' : 'danger'"
            v-if="total === 100 || total === 0 ? false : true"
            @click="handleBtn"
            >{{ abort ? "继续" : "暂停" }}</el-button
        >
    </div>
    <div></div>
</template>

<script>
import { defineComponent, reactive, toRefs } from "vue";
import { ElMessage } from "element-plus";
import axios from "axios";
import SparkMD5 from "spark-md5";
import { fileParse } from "./util";

export default defineComponent({
    name: "App",
    setup() {
        const state = reactive({
            total: 0,
            abort: false,
        });

        let fileData = {
            partList: [],
            hash: null,
        };
        async function changeFile(file) {
            if (!file) {
                return;
            }
            file = file.raw;
            let buffer = await fileParse(file, "buffer"),
                spark = new SparkMD5.ArrayBuffer(),
                hash,
                suffix;
            spark.append(buffer);
            hash = spark.end();
            suffix = /\.([0-9a-zA-Z]+)$/i.exec(file.name)[1];
            let partSize = file.size / 100,
                cur = 0;
            for (let i = 0; i < 100; i++) {
                let item = {
                    chunk: file.slice(cur, cur + partSize),
                    filename: `${hash}_${i}.${suffix}`,
                };
                cur += partSize;
                fileData.partList.push(item);
            }
            fileData.hash = hash;
            sendRequest();
        }
        function sendRequest() {
            let requestList = [];
            fileData.partList.forEach((item, index) => {
                let fn = async () => {
                    let formData = new FormData();
                    formData.append("chunk", item.chunk);
                    formData.append("filename", item.filename);
                    const result = await axios.post("/api/upload3", formData, {
                        headers: { "Content-Type": "multipart/form-data" },
                    });
                    if (result.status === 200) {
                        state.total += 1;
                        fileData.partList.splice(index, 1);
                    }
                };
                requestList.push(fn);
            });
            let i = 0;
            let complete = async () => {
                let result = await axios.get("/api/merge", {
                    params: {
                        hash: fileData.hash,
                    },
                });
                fileData = {
                    partList: [],
                    hash: null,
                };
                if (result.status === 200) {
                    ElMessage.success("upload success");
                }
            };
            let send = async () => {
                if (state.abort) {
                    return;
                }
                if (i >= requestList.length) {
                    complete();
                    return;
                }
                await requestList[i]();
                i++;
                send();
            };
            send();
        }

        function handleBtn() {
            if (state.abort) {
                // 暂停中
                state.abort = false;
                sendRequest();
            } else {
                state.abort = true;
            }
        }

        return {
            changeFile,
            ...toRefs(state),
            handleBtn,
        };
    },
});
</script>

<style scoped>
.progress {
    width: 400px;
}
</style>