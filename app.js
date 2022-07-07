//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

mongoose.connect('mongodb://localhost:27017/userDB', {
    useNewUrlParser: true
});
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});
userSchema.plugin(encrypt, {
    secret: process.env.SECRET ,
    encryptedFields: ["password"]
});
const User = new mongoose.model('user', userSchema);
const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set('view engine', 'ejs');
app.get('/home', function (req, res) {
    res.render('home');
});
app.get('/register', function (req, res) {
    res.render('register');
});
app.get('/login', function (req, res) {
    res.render('login');
});
app.listen(8080, function () {
    console.log("server is running on port 8080");

});
app.post('/register', function (req, res) {
    const newUser = new User({
        username: req.body.username,
        password: req.body.password
    });
    newUser.save(function (err) {
        if (!err) {
            res.render('secrets');
        } else {
            console.log("error on registration");
        }
    });
});
app.post('/login', function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({
        username: username
    }, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            if (result) {
                if (result.password === password) {
                    res.render('secrets');
                }
            }
        }
    });
});
