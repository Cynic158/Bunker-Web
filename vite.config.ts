import { defineConfig, loadEnv } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import path from "path";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import { prismjsPlugin } from "vite-plugin-prismjs";
import vueJsx from "@vitejs/plugin-vue-jsx";

// https://vitejs.dev/config/
export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return defineConfig({
    define: {
      "process.env": {
        NODE_ENV: JSON.stringify(mode),
        VITE_APP_TITLE: JSON.stringify(env.VITE_APP_TITLE),
        VITE_APP_BASE_API: JSON.stringify(env.VITE_APP_BASE_API),
        VITE_APP_BASE_URL: JSON.stringify(env.VITE_APP_BASE_URL)
        // 其他环境变量也可以在这里设置
      }
    },
    base: "/",
    build: {
      rollupOptions: {
        treeshake: true,
        output: {
          manualChunks(id) {
            if (!id.includes("node_modules")) return;

            // Vue 核心
            if (
              id.includes("vue") ||
              id.includes("vue-router") ||
              id.includes("pinia")
            ) {
              return "vendor-vue";
            }

            // Element Plus UI
            if (
              id.includes("element-plus") ||
              id.includes("@element-plus/icons-vue")
            ) {
              return "vendor-element-plus";
            }

            // 网络请求
            if (id.includes("axios") || id.includes("axios-retry")) {
              return "vendor-axios";
            }

            // lodash
            if (id.includes("lodash")) {
              return "vendor-lodash";
            }

            // PrismJS
            if (id.includes("prismjs") || id.includes("vite-plugin-prismjs")) {
              return "vendor-prism";
            }

            // Swagger UI
            if (id.includes("swagger-ui-dist")) {
              return "vendor-swagger";
            }
          }
        }
      },
      chunkSizeWarningLimit: 2000
    },
    plugins: [
      vue(),
      vueJsx(),
      prismjsPlugin({
        languages: ["bash"],
        plugins: ["toolbar", "show-language", "copy-to-clipboard"],
        theme: "solarizedlight", //主题名称
        css: true
      }),
      createHtmlPlugin({
        inject: {
          data: {
            title: env.VITE_APP_TITLE
          }
        }
      }),
      // element自动引入
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      }),
      createSvgIconsPlugin({
        // Specify the icon folder to be cached
        iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
        // Specify symbolId format
        symbolId: "icon-[dir]-[name]"
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve("./src"), // 相对路径别名配置，使用 @ 代替 src
        "path": "path-browserify"
      }
    },
    // scss全局变量
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: '@import "@/styles/variable.scss";',
          api: "modern-compiler"
        }
      }
    },
    // 代理跨域
    server: {
      proxy: {
        [env.VITE_APP_BASE_API]: {
          target: env.VITE_APP_BASE_URL,
          changeOrigin: true
        }
      }
    }
  });
};
