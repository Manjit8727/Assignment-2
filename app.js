/*
Name: Manjit kaur
Student ID: 301134995
File name: Manjitkaur_COMP229_assignment2
Date: 23/10/2020
*/
const express = require('express');
const app = express();
const flash = require('connect-flash');
const passport = require('passport');

const mongoose = require('mongoose');
const User = require('./models/user.js');
var url = "mongodb://localhost:27017/assignment";
var bodyParser = require("body-parser");
app.use(express.urlencoded({ extended: true }));


require('./passport-config')(passport)

//db connect
mongoose.connect(url, {useNewUrlParser: true}).then((db) => {
    console.log('db connected')
  

}).catch((err) => console.log(err));
app.listen(8080);
app.set("view engine", "ejs");


//session initialize

app.use(require("express-session")({
    secret: "secret",
    resave: true,
    saveUninitialized: true
}));
//passport initalize
app.use(passport.initialize());
app.use(passport.session())

app.use(flash())
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });

//Routes
app.use('/', require('./routes/routes.js'));
