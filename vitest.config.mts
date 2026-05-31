import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    dir: "src",
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
  },
});
