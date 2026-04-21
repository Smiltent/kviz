
import Express from "./services/Express"
import Database from "./services/Mongo"

import path from "path"
import fs from "fs"

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// arguments
const debugArg = process.argv.find(arg => arg.startsWith("--debug"))
const debug = debugArg ? true : false

const envArg = process.argv.find(arg => arg.startsWith("--env="))
const env = envArg ? `.${envArg.split('=')[1]}` : ''

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// watching
const entries = fs.readdirSync("./private/ts")
    .filter(f => f.endsWith(".ts"))
    .map(f => path.join("./private/ts", f))

await Bun.build({
    entrypoints: entries,
    outdir: './public/js',
    target: 'browser',
    minify: env == ''
})

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

require('dotenv').config({ path: `.env${env}` })

import log from './utils/log.ts'
log(debug)

export const databaseClient = new Database(process.env.DATABASE_CONNECTION!)
export const expressClient = new Express(process.env.PORT!)
