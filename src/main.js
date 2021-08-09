import { createApp } from 'vue'
import App1 from './App1.vue'
import App2 from './App2.vue'
import App3 from './App3.vue'
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';


createApp(App3).use(ElementPlus).mount('#app')

