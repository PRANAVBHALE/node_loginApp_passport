var express = require('express');
var router = express.Router()
var passport = require('passport');


debugger

router.get('/auth/facebook',
    passport.authenticate('facebook',
    {scope: ['email']}
  ));

// GET /auth/facebook/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get( '/auth/facebook/callback',
    	passport.authenticate( 'facebook', {
    		successRedirect: '/',
    		failureRedirect: '/login'
}),function(err,user,info) {
  debugger
  // Successful authentication, redirect home.
  console.log(req.body);
   res.redirect('/');
// res.send('Hello')
// console.log(err,user,info);
});;
module.exports = router
