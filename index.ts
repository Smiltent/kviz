
import Express from "./services/Express"
import Database from "./services/Mongo"

import dotenv from "dotenv"
dotenv.config()

export const databaseClient = new Database(String(process.env.DATABASE_CONNECTION))
export const expressClient = new Express(process.env.PORT)