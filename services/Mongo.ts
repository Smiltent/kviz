
import mongoose from "mongoose"

export default class Database {
    constructor(private uri: string = process.env.DATABASE_CONNECTION!) {
        this.connect()
    }

    private async connect() {
        try {
            console.debug("Connecting to Database...")
            await mongoose.connect(this.uri)

            console.info("Connected to Database!")
        } catch (err) {
            console.error("Failed to connect to Database, exiting...")
            process.exit(0)
        }
    }
}