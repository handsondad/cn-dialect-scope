import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // 相对路径：部署在 GitHub Pages 的 /<仓库名>/ 子路径下也能找到资源（路由用的是 hash，不受影响）
  base: "./",
  plugins: [react()]
});
