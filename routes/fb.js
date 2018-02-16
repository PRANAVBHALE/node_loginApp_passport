var express = require('express');
var router = express.Router()
var passport = require('passport');



router.post('/auth/facebook',
  passport.authenticate('facebook'));

router.post('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login',session:false }),
  function(err,user,info) {
    debugger
    // Successful authentication, redirect home.
    console.log(req.body);
     res.redirect('/');
  // res.send('Hello')
  // console.log(err,user,info);
});

module.exports = router
