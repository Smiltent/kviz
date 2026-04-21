
import { registerRoutes } from "./express/registerRoutes.ts"
import root from "@/middlewares/root.middleware.ts"
import cookieParser from "cookie-parser"
import express from "express"
import path from "path"

export default class Express {
    private app: express.Express

    constructor(private port: string | number = 3000) {
        this.app = express()

        this.app.set("view engine", "ejs")
        this.app.set("layout", "components/$index")

        this.middleware()
        this.routes()
        this.public()
        this.start()
    }

    private middleware() {
        this.app.use(express.json())
        this.app.use(cookieParser())
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(express.static("public"))
    }

    private async routes() {
        this.app.use(root)

        await registerRoutes(this.app)

        this.app.use((req, res) => {
            res.status(404).render("404")
        })
    }

    private public() {
        const isDev = process.env.NODE_DEV === "dev"

        this.app.use(
            '/public',
            express.static(path.join(__dirname, '..', 'public'), {
                etag: !isDev,
                lastModified: !isDev,
                maxAge: isDev ? 0 : '10s',
            })
        )
    }

    private start() {
        this.app.listen(this.port, () => {
            console.info(`Server starting on http://0.0.0.0:${this.port}`)
        })
    }
}