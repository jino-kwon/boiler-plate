const { User } = require('../models/User');

let auth = (req, res, next) => {
    // step1: get a token from client cookies
    let token = req.cookies.x_auth;

    // step2: encrypt the token and find the user
    User.findByToken(token, (err, user) => {
        if (err) throw err;
        if (!user) return res.json({ isAuth: false, error: true  })

        req.token = token;
        req.user = user;
        next();
    })
}

module.exports = { auth };