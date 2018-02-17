var express = require('express');
var router = express.Router()
var passport = require('passport');


router.get('/auth/github',
    passport.authenticate('github',
    {scope: ['email']}
  ));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get( '/auth/github/callback',
    	passport.authenticate( 'github', {
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
