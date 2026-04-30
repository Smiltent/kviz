
import { registerRoutes } from "./express/registerRoutes.ts"
import root from "@/middlewares/root.middleware.ts"
import expressLayouts from "express-ejs-layouts"
import cookieParser from "cookie-parser"
import express from "express"
import path from "path"

export default class Express {
    private app: express.Express

    constructor(private port: string | number = process.env.PORT!) {
        this.app = express()

        this.i()
    }

    private async i() {
        await this.middleware()
        await this.public()
        await this.routes()
        this.start()
    }

    private async middleware() {
        this.app.use(expressLayouts)
        this.app.use(express.json())
        this.app.use(cookieParser())
        this.app.use(express.urlencoded({ extended: true }))

        this.app.set("view engine", "ejs")
        this.app.set("layout", "components/$index")

        this.app.use(root)
        this.app.use(express.static("public"))
    }

    private async routes() {
        await registerRoutes(this.app)

        this.app.use((req, res) => {
            res.status(404).render("404")
        })
    }

    private async public() {
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