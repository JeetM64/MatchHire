require("dotenv").config()
const mongoose = require("mongoose")

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("MongoDB connected")
    } catch (e) {
        console.error("Database connection error:", e)
        process.exit(1)
    }
}

module.exports = connectDB;