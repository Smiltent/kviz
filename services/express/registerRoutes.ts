
import type { Application } from "express"
import path from "path"
import fs from "fs"

// automatically register routes in the `routes/` folder, without having to manually register them
export async function registerRoutes(app: Application) {
    const dir = path.join(__dirname, "..", "..", "routes")

    const files = fs.readdirSync(dir).filter(f => {
        return f.endsWith(".routes.ts") || f.endsWith(".routes.js")
    })

    if (files.length === 0) {
        console.error("No routes found (routes/)")
        process.exit(0)
    }

    for (const file of files) {
        const fPath = path.join(dir, file)

        // panel.routes.ts => /panel
        const name = path.basename(file)
            .replace(/\.routes\.(ts|js)$/, "")
            .replace(".", "/") 

        const mount = name === "root" ? "/" : `/${name}`

        try {
            const module = await import(fPath)
            const router = module.default

            if (!router || typeof router !== "function") {
                console.warn(`Skipping ${file} - no default export!`)
                continue
            } 

            app.use(mount, router)
            console.debug(`Mounted ${file} -> ${mount}`)
        } catch (err) {
            console.error(`Failed to load ${file}: ${err}`)
        }
    }
}