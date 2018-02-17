var express = require('express');
var router = express.Router()
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook')


var User = require("../models/user")



//#Resgister
router.get('/register',function (req,res) {
  res.render('register')
})


//#login
router.get('/login',function (req,res) {
  res.render('login')
  console.log(req);
})

router.post('/register',function (req,res) {
  console.log(req);
  console.log(req.body);

  var name = req.body.name
  var username = req.body.username
  var dob = req.body.dob
  var mobile = req.body.mobile
  var email = req.body.email
  var password = req.body.password
  var cpassword = req.body.cpassword

  req.checkBody('name','Name is required').notEmpty()

  req.checkBody('email','Email is required').notEmpty()
  req.checkBody('email','Email is not valid').isEmail()
  //req.checkBody('email','Email is taken').isUnique()

  req.checkBody('username','username is required').notEmpty()

  req.checkBody('password','Password is required').notEmpty()
  req.checkBody('cpassword','Confirm Password is required').notEmpty()

  req.checkBody('dob','Date of Birth is required').notEmpty();
  //req.checkBody('dob','Date of Birth should be date').isDate()

  req.checkBody('mobile','Must have maximum lenth of 10').isLength({max:10})

  var errors = req.validationErrors()

  if (errors) {
    //console.log('Yes');
    res.render('register',{
      errors:errors
    })
  }else {
  //  console.log('Passed');

  var newUser = new User({
    name:name,
    email:email,
    password:password,
    username:username,
    dob:dob,
    mobile:mobile
  })

  User.createUser(newUser,function (err,user) {
    if(err) throw err
    console.log(user);
  })

  debugger
  //console.log(req.flash());

  req.flash('success_msg','you are registered and can now login')

  res.redirect('/users/login')



  }
})


passport.use(new LocalStrategy(
  function(username, password, done) {
    debugger
    User.getUserByUsername(username,function (err,user) {
      if(err) throw err

      if(!user){
        return done(null,false,'Unknwon User')
      }

      User.comparePassword(password,user.password,function(err,isMatch){
        if(err) throw err
        debugger
        if(isMatch){
          return done(null,user)

        }else {
            return done(null,false,{message:'Invalid password'})
        }
      })

    })
  }
));



// router.get('/auth/facebook',
//   passport.authenticate('facebook'));
//
// router.get('/auth/facebook/callback',
//   passport.authenticate('facebook', { failureRedirect: '/login',session:false }),
//   function(err,user,info) {
//     debugger
//     // Successful authentication, redirect home.
//     console.log(req.body);
//      res.redirect('/');
//   // res.send('Hello')
//   // console.log(err,user,info);
// });

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

//Login page button data

router.post('/login',
  passport.authenticate('local',{
    successRedirect:'/',
    failureRedirect:'/users/login',
    failureFlash:true
  }),
  function(req, res) {

    res.redirect('/');
  });

  router.get('/logout',function(req,res){
    req.logout()

    req.flash('success_msg','You have logged out')

    res.redirect('/users/login')
  })

module.exports = router
