import { createApp } from "vue";
import App from "./App.vue";
import "element-plus/dist/index.css";
// 全局样式
import "@/styles/index.scss";
// 暗黑模式样式
import "element-plus/theme-chalk/dark/css-vars.css";
// 配置svg
import "virtual:svg-icons-register";
// 注册全局组件
import gloablComponent from "./components/index";
// 注册路由
import router from "./router";
// 注册仓库
import store from "./store";

const app = createApp(App);

// 使用全局组件和插件
app.use(gloablComponent);
app.use(store);
app.use(router);

app.mount("#app");