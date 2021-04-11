const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const { auth } = require('./middleware/auth');
const { User } = require("./models/User");

// analyze/take info from 'application/x-ww-form-urlencode'
app.use(bodyParser.urlencoded({extended: true}));
// analyze/take info from 'application/json'
app.use(bodyParser.json());
app.use(cookieParser());

app.get('/api/hello', (req, res)=>{
    res.send("hello hello")
})

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))


// This is for route
app.get('/', (req, res) => res.send('Hello World! ha!!'))

app.post('/api/users/register', (req, res)=> {
    // asking info for membership login from client
    // Then, add to the database
    const user = new User(req.body)
    // this is mongoDB method
    user.save((err, userInfo)=> {
        if (err) return res.json({success: false, err})
        return res.status(200).json({
            success: true
        })
    })
})

// login route
app.post('/api/users/login', (req,res) => {
    // find a requested email in the database
    User.findOne({email: req.body.email}, (err, user)=> {
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "Could not find your account!"
            })
        }
        // if email's in db, check pw
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch)
                return res.json({loginSuccess: false, message: "Incorrect Password"})

            // create a token if pw's right
            user.generateToken((err, user)=> {
                if(err) return res.status(400).send(err);

                // save a token in WHERE? cookies, local storage, etc. (there are many options)
                // here, we're storing a token in cookies.
                res.cookie("x_auth", user.token)
                   .status(200)
                   .json({ loginSuccess: true, userId: user._id })
            })
        })
    })
})

// Authentification router
app.get('/api/users/auth', auth, (req, res)=> {
    // if the program gets here (past the middleware),
    // it means auth is true
    res.status(200).json ({
        _id: req.user._id,
        // role==0 => general user / role!=0 => admin
        isAdmin: req.user.role === 0 ? false: true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

// Logout router (delete the token in DB-> automatically user's logged out)
app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id },
        // delete the token
        { token: "" },
        (err, user) => {
            if (err) return res.json({success: false, err});
            return res.status(200).send({
                success: true
            })
        })
})

app.listen(port, ()=> console.log(`Example app listening on port ${port}!`))