
import mongoose from "mongoose"

export default class Database {
    constructor(private uri: string) {
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