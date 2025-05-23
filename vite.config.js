import { defineConfig } from "vite";
import { internalIpV4 } from "internal-ip";
// import { viteSingleFile } from "vite-plugin-singlefile";
// import { createHtmlPlugin } from "vite-plugin-html";
// import tauri from "vite-plugin-tauri"; 

// @ts-expect-error process is a nodejs global
const mobile = !!/android|ios/.exec(process.env.TAURI_ENV_PLATFORM);

// export default defineConfig({
//   define: {
//     VERSION: JSON.stringify(process.env.npm_package_version),
//   },
//   build: {
//     sourcemap: true,
//     rollupOptions: {
//       output: {
//         entryFileNames: `[name].js`,
//         chunkFileNames: `[name].js`,
//         assetFileNames: `[name].[ext]`,
//       },
//     },
//   },
//   plugins: [viteSingleFile(), createHtmlPlugin({ minify: true })],
// });


export default defineConfig({
  // 防止 Vite 清除 Rust 显示的错误
  clearScreen: false,
  server: {
    // Tauri 工作于固定端口，如果端口不可用则报错
    strictPort: true,
    port: 5173,
    // 如果设置了 host，Tauri 则会使用
    host: mobile ? "0.0.0.0" : false,
    hmr: mobile
      ? {
        protocol: "ws",
        host: await internalIpV4(),
        port: 1421,
      }
      : undefined,
  },
  watch: {
    // 3. tell vite to ignore watching `src-tauri`
    ignored: ["**/src-tauri/**"],
  },
  // 添加有关当前构建目标的额外前缀，使这些 CLI 设置的 Tauri 环境变量可以在客户端代码中访问
  envPrefix: ['VITE_', 'TAURI_ENV_*'],
  build: {
    // Tauri 在 Windows 上使用 Chromium，在 macOS 和 Linux 上使用 WebKit
    // target:
    //   process.env.TAURI_ENV_PLATFORM == 'windows'
    //     ? 'chrome105'
    //     : 'safari13',
    // 在 debug 构建中不使用 minify
    minify: !process.env.TAURI_ENV_DEBUG ? 'esbuild' : false,
    // 在 debug 构建中生成 sourcemap
    sourcemap: !!process.env.TAURI_ENV_DEBUG,
  }
});
