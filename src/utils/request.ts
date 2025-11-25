import axios from "axios";
import { ElNotification } from "element-plus";
// 导入用户仓库
import useUserStore from "@/store/modules/user";
// 导入路由函数
import { routerPush } from "@/router";
// axios重试
import axiosRetry from "axios-retry";

// 创建axios实例
let request = axios.create({
  baseURL: `${import.meta.env.VITE_APP_BASE_URL}${import.meta.env.VITE_APP_BASE_API}`,
  timeout: 10000,
  withCredentials: true, // 跨域请求时发送cookie
});

// 为axios添加失败重试功能
axiosRetry(request, { retries: 2, retryDelay: axiosRetry.exponentialDelay });

//响应拦截器
request.interceptors.response.use(
  (response) => {
    if (response.headers["content-disposition"]) {
      const filenameInfo = response.headers["content-disposition"];
      const filename = filenameInfo.match(/filename=(.+?)(;|$)/)[1];
      // 创建 Blob
      const blob = new Blob([response.data], {
        type: "application/octet-stream"
      });
      // 创建 URL
      const url = window.URL.createObjectURL(blob);
      // 创建 <a> 元素
      const link = document.createElement("a");
      // 设置 <a> 元素的属性
      link.href = url;
      link.download = filename;
      // 模拟点击 <a> 元素
      link.click();
      // 释放 URL 对象
      window.URL.revokeObjectURL(url);
    }
    return response.data;
  },
  (error) => {
    // 新建一个reader对象读取blob数据
    let reader = new FileReader();
    // 根据状态码进行判断
    switch (error.response.status) {
      case 401:
        reader.onload = function () {
          // 读取返回的JSON数据
          const jsonData = JSON.parse(reader.result?.toString() || "{}");
          // 在这里处理返回的 JSON 数据，例如显示错误信息
          ElNotification({
            type: "warning",
            title: "Warning",
            message: jsonData.message || "请先登录",
            duration: 3000
          });
          // 使用用户仓库的清空信息函数
          let userStore = useUserStore();
          // 清空用户信息
          userStore.clearUser();
          // 跳转到登录页
          routerPush("/login");
          // 刷新当前页面
          //location.reload();
        };
        if (error.response.data instanceof Blob) {
          reader.readAsText(error.response.data);
        } else {
          ElNotification({
            type: "warning",
            title: "Warning",
            message: error.response.data.message || "请先登录",
            duration: 3000
          });
          // 使用用户仓库的清空信息函数
          let userStore = useUserStore();
          // 清空用户信息
          userStore.clearUser();
          // 跳转到登录页
          routerPush("/login");
          // 刷新当前页面
          //location.reload();
        }
        break;
      case 403:
        reader.onload = function () {
          // 读取返回的JSON数据
          const jsonData = JSON.parse(reader.result?.toString() || "{}");
          // 显示错误信息
          ElNotification({
            type: "warning",
            title: "Warning",
            message: jsonData.message || "无权访问",
            duration: 3000
          });
        };
        if (error.response.data instanceof Blob) {
          reader.readAsText(error.response.data);
        } else {
          // 显示错误信息
          ElNotification({
            type: "warning",
            title: "Warning",
            message: error.response.data.message || "无权访问",
            duration: 3000
          });
        }
        break;
      default:
        // console.log(error);
        break;
    }
    return Promise.reject(error);
  }
);
export default request;
