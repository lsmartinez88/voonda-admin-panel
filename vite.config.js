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
            "/api": {
                target: "https://api.fratelli.voonda.net",
                changeOrigin: true,
                secure: true,
                configure: (proxy, options) => {
                    proxy.on("proxyReq", (proxyReq, req, res) => {
                        // Limpiar headers problemáticos que pueden causar CORS
                        proxyReq.removeHeader("origin")
                        proxyReq.removeHeader("referer")

                        // Asegurar headers necesarios
                        proxyReq.setHeader("Accept", "application/json")
                        proxyReq.setHeader("Content-Type", "application/json")

                        console.log(`🔄 Proxy request: ${req.method} ${req.url}`)
                    })

                    proxy.on("proxyRes", (proxyRes, req, res) => {
                        console.log(`📥 Proxy response: ${proxyRes.statusCode} ${req.url}`)

                        // Agregar headers CORS para evitar problemas en el cliente
                        res.setHeader("Access-Control-Allow-Origin", "*")
                        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
                        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
                    })

                    proxy.on("error", (err, req, res) => {
                        console.error(`❌ Proxy error: ${err.message}`)
                        res.writeHead(500, {
                            "Content-Type": "text/plain"
                        })
                        res.end("Proxy error: " + err.message)
                    })
                }
            }
        }
    }
})
