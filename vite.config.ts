import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Manually load `.env.public`
  const publicEnvPath = path.resolve(process.cwd(), ".env.public");

  if (fs.existsSync(publicEnvPath)) {
    dotenv.config({ path: publicEnvPath });
  }

  // Load other env files with Vite's loadEnv function
  const env = loadEnv(mode, process.cwd(), "VITE_");

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(
      Boolean
    ),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      // Convert environment variables to be accessible via import.meta.env
      "import.meta.env": JSON.stringify(process.env),
    },
  };
});
