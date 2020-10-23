/*
    
Name: Manjit kaur
Student ID: 301134995
File name: Manjitkaur_COMP229_assignment2
Date: 23/10/2020

*/
const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user.js');

const { ensureAuthenticated, forwardAuthenticated } = require('../auth.js');

router.get('/login', forwardAuthenticated, (req, res) => res.render('login/login.ejs'))
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard.ejs', { user: req.user })
}
)


router.post('/editcontact', ensureAuthenticated, (req, res) => {
    
    var obj = {name: req.body.name, phonenum: req.body.phone, email: req.body.email}
    User.update({"contacts.phonenum": obj.phonenum}, {"$set": {
        'contacts.$.name': obj.name,
        'contacts.$.phonenum': obj.phonenum,
        'contacts.$.email': obj.email,
    }}).then(e =>{ 
       
        res.redirect('/updatecontact')}).catch(err => console.log(err));
        
    });

router.get('/editcontact', ensureAuthenticated, (req, res) => { 

res.render('editcontact.ejs', {contact: JSON.parse(req.query.data)});
})

router.post('/deletecontact', ensureAuthenticated, (req, res) => {
var phone = req.body.number;
User.update( 
    { "_id" : req.user._id} , 
    { "$pull" : { "contacts" : { "phonenum" :  phone } } } , 
    { "multi" : false }  
).then((d) => console.log(d)).catch(error => console.log(error))
res.redirect("/updatecontact")
})

router.get('/updatecontact', ensureAuthenticated, (req, res) => {
    res.render('updation.ejs', { user: req.user })
});

router.get('/', (req, res) => {
    res.render('index.ejs', {'auth': req.isAuthenticated()});
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
});


router.post('/login',  (req, res, next) => {

    
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next)

});



module.exports = router
