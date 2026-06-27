const express = require("express")
const cookieParser = require("cookie-parser")
const Authrouter = require("./router/auth.router")
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use("/api/auth", Authrouter)

module.exports = app;