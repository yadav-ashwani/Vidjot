const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
var flash = require('connect-flash');
var session = require('express-session');
var methodOverride = require('method-override');
const mongoose = require('mongoose');

const app = express();


//How Middleware works
// app.use((req,res,next) => {
//     console.log(Date.now());
//     req.name = 'Brad Traversy';
//     next();
// })

//Handlebar Middleware

app.set('view engine', 'ejs');

//Bodyparser middleware
app.use(express.urlencoded({extended : false}));
app.use(express.json());

//Static Folder
app.use(path.join(__dirname,'public'));

//Method Override Middleware
app.use(methodOverride('_method'));

//Express Session Middleware
app.use(session({
    secret: 'secure',
    resave: true,
    saveUninitialized: true,
   
}));

app.use(flash());

//Global Variables
app.use(function(req,res,next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//Index Route
app.get('/', (req,res) => {
   res.render('index',{title : 'Welcome'});
});


//About Route
app.get('/about', (req,res) => {
    res.render('about');
});


//Load Routes

app.use('/ideas', require('./routes/ideas'));
app.use('/users', require('./routes/users'));


const port = 5000;
app.listen(port , () => {
    console.log(`Server started on port ${port}`);
})