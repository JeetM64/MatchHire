const express = require("express")
const { registerUser, loginUser } = require("../controllers/auth.contollers")
const Authrouter = express.Router()


/**
 * post api/auth/register
 */
Authrouter.post("/register", registerUser)

/**
 * post api/auth/login
 */
Authrouter.post("/login", loginUser)



module.exports = Authrouter;