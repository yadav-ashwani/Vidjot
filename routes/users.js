const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

//Passport Config
require('../config/passport')(passport);

//Load user Model
const User = require('../models/User');

//User login Route
router.get('/login',(req,res) => {
    res.render('login');
});

//User Register Route
router.get('/register',(req,res) => {
    res.render('register');
});

//Login form post
router.post('/login',  (req,res,next) => {
    passport.authenticate('local', {
        successRedirect : '/ideas',
        failureRedirect : '/users/login',
        failureFlash : true
    })(req,res,next);
})

//Register Form Post
router.post('/register', (req,res) => {
    // console.log(req.body);
    // res.send('register');
    const {name , password , password2 , email} = req.body;
    let errors1 = [];
    if(!name){
        errors1.push({text : 'Please enter name'});
    }
    if(!email){
        errors1.push({text : 'Please enter email'});
    }
    if(!password){
        errors1.push({text : 'Please enter password'});
    }
    if(!password2){
        errors1.push({text : 'Please confirm your password'});
    }
    if(password !== password2){
        errors1.push({text : 'Passwords do not match'});
    }
    if(password.length < 4){
        errors1.push({text : 'Password must be atleast 4 characters'})
    }
    if(errors1.length > 0){
        res.render('register',{
            errors1 : errors1 ,
        })
    }else{
        User.findOne({email : email}).then(user => {
            if(user){
                req.flash('error_msg','Email already registered');
                res.redirect('/users/register');
            }
            else{
                const newUser = new User({
                    name : name,
                    email : email,
                    password : password
                 })
          
                bcrypt.genSalt(10 , (err, salt) => {
                    bcrypt.hash(newUser.password , salt , (err , hash) => {
                        if(err)
                        throw err;
                        newUser.password = hash;
                        newUser.save().then(user => {
                            req.flash('success_msg' , 'you are now registered and now you can login');
                            res.redirect('/users/login');
                        }).catch(err => {
                             console.log(err);
                             return;
                        })
                    })
                })
            }
        })
     
    }
});

//Logout User
router.get('/logout', (req,res) => {
    req.logout();
    req.flash('success_msg','You are now logged out');
    res.redirect('/users/login');
})

module.exports = router;
