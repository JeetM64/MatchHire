require("dotenv").config()
const userModel = require("../models/user.model")
const blacklistModel = require("../models/blacklist.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
async function registerUser(req, res) {
    try {
        const { username, email, password } = req.body

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const isUserAlready = await userModel.findOne({
            $or: [{ email }, { username }]
        })

        if (isUserAlready) {
            return res.status(409).json({ message: "Username or email is already taken" })
        }

        const hash = await bcrypt.hash(password, 10)

        const user = await userModel.create({
            username,
            email,
            password: hash
        })

        const token = jwt.sign(
            {
                id: user._id,
                username: user.username
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "lax" })

        return res.status(201).json({
            message: "User registered successfully",
            user: { id: user._id, username: user.username, email: user.email },
            token
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Server error during registration" })
    }
}

async function loginUser(req, res) {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" })
        }

        const token = jwt.sign(
            {
                id: user._id,
                username: user.username
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "lax" })

        return res.status(200).json({
            message: "User logged in successfully",
            user: { id: user._id, username: user.username, email: user.email },
            token
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Server error during login" })
    }
}


async function logoutUser(req, res) {
    const token = req.body?.token || req.cookies?.token

    if (!token) {
        return res.status(401).json({ message: "Token is required to logout" })
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
        console.error(error)
        return res.status(401).json({ message: "Token is not valid" })
    }

    try {
        await blacklistModel.create({ token })
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "Strict"
        })
        return res.json({ message: "Logged out successfully" })
    } catch (e) {
        console.error(e)
        return res.status(500).json({ message: "Logout failed" })
    }
}

module.exports = { registerUser, loginUser, logoutUser }
