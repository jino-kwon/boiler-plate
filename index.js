const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');

const config = require('./config/key');
const {User} = require("./models/User");

// analyze/take info from 'application/x-ww-form-urlencode'
app.use(bodyParser.urlencoded({extended: true}));
// analyze/take info from 'application/json'
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))


// This is for route
app.get('/', (req, res) => res.send('Hello World! ha!!'))

app.post('/register', (req, res)=> {
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

app.listen(port, ()=> console.log(`Example app listening on port ${port}!`))