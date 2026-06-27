const mongoose = require("mongoose")

const userRegister = new mongoose.Schema(
    {
        username: { type: String, required: true, trim: true, unique: true },
        email: { type: String, required: true, trim: true, lowercase: true, unique: true },
        password: { type: String, required: true }
    },
    { timestamps: true }
)

const UserModel = mongoose.model("User", userRegister)

module.exports = UserModel