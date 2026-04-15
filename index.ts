
import Express from "./services/Express"
import Database from "./services/Mongo"

require('dotenv').config()

import log from './utils/log.ts'
log(process.env.DEBUG!)

export const databaseClient = new Database(String(process.env.DATABASE_CONNECTION))
export const expressClient = new Express(process.env.PORT)
