import { defineConfig, loadEnv } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import path from "path";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import { prismjsPlugin } from "vite-plugin-prismjs";
import { visualizer } from "rollup-plugin-visualizer";
import vueJsx from '@vitejs/plugin-vue-jsx';

const getEnvFn = (mode: string, target: string) => {
  return loadEnv(mode, process.cwd())[target];
};

const dependencies = require('./package.json').dependencies;

// https://vitejs.dev/config/
export default ({ mode }) =>
  defineConfig({
    define: {
      "process.env": {
        NODE_ENV: JSON.stringify(mode), // 使用 Vite 的 mode 作为 NODE_ENV
        VITE_APP_TITLE: JSON.stringify(getEnvFn(mode, "VITE_APP_TITLE")),
        VITE_APP_BASE_API: JSON.stringify(getEnvFn(mode, "VITE_APP_BASE_API")),
        VITE_APP_BASE_URL: JSON.stringify(getEnvFn(mode, "VITE_APP_BASE_URL")),
        // 其他环境变量也可以在这里设置
      },
    },
    base: "/",
    build: {
      rollupOptions: {
        treeshake: true,
        output: {
          // 根据不同的js库 拆分包，减少index.js包体积
          manualChunks(id) {
            if (id.includes('node_modules')) {
              // 指定需要拆分的第三方库或模块
              const dependenciesKeys = Object.keys(dependencies);
              const match = dependenciesKeys.find((item) => {
                  return id.includes(item);
              });
              const notSplit = ['vue', 'ant-design-vue'];
              if (match && !notSplit.includes(match)) {
                  return match;
              }
            }
          },
        },
      },
      chunkSizeWarningLimit: 2000,
    },
    plugins: [
      vue(),
      vueJsx(),
      prismjsPlugin({
        languages: [
          "bash",
        ],
        plugins: [
          'toolbar', 
          'show-language', 
          'copy-to-clipboard',
        ], 
        theme: "solarizedlight", //主题名称
        css: true,
      }),
      createHtmlPlugin({
        inject: {
          data: {
            title: getEnvFn(mode, "VITE_APP_TITLE"),
          },
        },
      }),
      // element自动引入
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      createSvgIconsPlugin({
        // Specify the icon folder to be cached
        iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
        // Specify symbolId format
        symbolId: "icon-[dir]-[name]",
      }),
      visualizer({ open: true }),
      visualizer({
        open: true,
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve("./src"), // 相对路径别名配置，使用 @ 代替 src
        'path': 'path-browserify',
      },
    },
    // scss全局变量
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: '@import "@/styles/variable.scss";',
          api: 'modern-compiler'
        },
      },
    },
    // 代理跨域
    server: {
      proxy: {
        [getEnvFn(mode, "VITE_APP_BASE_API")]: {
          // 服务器地址
          target: getEnvFn(mode, "VITE_APP_BASE_URL"),
          // 代理跨域
          changeOrigin: true,
          // 路径重写
          // rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  });
