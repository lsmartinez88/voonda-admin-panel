import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: [
            { find: "@jumbo", replacement: "/@jumbo" },
            { find: "@assets", replacement: "/@assets" },
            { find: "@", replacement: "/src" }
        ]
    },
    define: {
        global: "window"
    },
    optimizeDeps: {
        include: ["react-draft-wysiwyg"]
    },
    server: {
        proxy: {
            // Proxy para la API en desarrollo
            "/api": {
                target: "https://api.fratelli.voonda.net",
                changeOrigin: true,
                secure: true,
                rewrite: (path) => path.replace(/^\/api/, ""),
                configure: (proxy, _options) => {
                    proxy.on("error", (err, _req, _res) => {
                        console.log("proxy error", err)
                    })
                    proxy.on("proxyReq", (proxyReq, req, _res) => {
                        console.log("Enviando Request:", req.method, req.url)
                    })
                    proxy.on("proxyRes", (proxyRes, req, _res) => {
                        console.log("Recibió Response:", proxyRes.statusCode, req.url)
                    })
                }
            }
        }
    }
})
