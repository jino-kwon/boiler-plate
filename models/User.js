const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: String,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    // tokenExp : token's available time limit
    tokenExp: {
        type: Number
    }
})
// 'model' is a wrapper for schema
const User = mongoose.model('User', userSchema)
// module exports allow me to use the model elsewhere
module.exports = { User }