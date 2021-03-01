const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

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

userSchema.pre('save', function(next) {
    var user = this;
    // Important! encrypt pw only when users change pw
    // when they change email, i.e., don't re-encrypt their pw
    if(user.isModified('password')) {
        // pw encryption
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if (err) return next(err)

            bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err)
            user.password = hash
            next()
            })
        });
    } else {
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb) {
    // plainPassword 1234567 encryped pw: !@$4....
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        // cb = callback
        if(err) return cb(err);
        cb(null, isMatch);
    })
}

userSchema.methods.generateToken = function(cb) {
    var user = this;
    // create a token using jsonwebtoken
    var token = jwt.sign(user._id.toHexString(), 'sectretToken')
    // user._id + 'secretToken' = token
    // ->
    // 'sectretToken' -> user._id
    user.token = token
    user.save(function(err, user) {
        if(err) return cb(err);
        cb(null, user);
    })
}

userSchema.statics.findByToken = function(token, cb) {
    var user = this;

    // user._id + '' = token
    // decode the token
    jwt.verify(token, 'secretToken', function(err, decoded) {
    // find the user using their ID. Then,
    // see if a token from the client and one stored in DB match.
        user.findOne({"_id": decoded, "token": token}, function (err, user) {
            if (err) return cb(err);
            cb(null, user);            
        })
    })
}

// 'model' is a wrapper for schema
const User = mongoose.model('User', userSchema)
// module exports allow me to use the model elsewhere
module.exports = { User }