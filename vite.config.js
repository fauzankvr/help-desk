import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: "src/index.js", // entry file of your package
      name: "HelpDesk",
      fileName: (format) => `index.${format}.js`,
      formats: ["es", "cjs"], // 👈 generate BOTH esm and cjs
    },
    rollupOptions: {
      external: ["react", "react-dom"], // don’t bundle React
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
