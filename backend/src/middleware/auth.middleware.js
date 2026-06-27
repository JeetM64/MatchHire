const jwt = require("jsonwebtoken")
const blacklistModel = require("../models/blacklist.model")

async function authMiddleware(req, res, next) {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1]

  if (!token) {
    return res.status(401).json({ message: "Authentication token is required" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const blacklisted = await blacklistModel.findOne({ token })
    if (blacklisted) {
      return res.status(401).json({ message: "Token is revoked" })
    }

    req.user = {
      id: decoded.id,
      username: decoded.username
    }

    next()
  } catch (error) {
    console.error(error)
    return res.status(401).json({ message: "Invalid or expired token" })
  }
}

module.exports = authMiddleware
