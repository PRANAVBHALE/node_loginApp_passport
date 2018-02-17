var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session')
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook')
var GoogleStrategy = require('passport-google-oauth2').Strategy
var GitHubStrategy = require('passport-github').Strategy;

var mongo = require('mongodb');
var mongoose = require('mongoose');





//mongoose.connect('mongodb://localhost/mongo-data-login-reg')
//mongoose.Promise = global.Promise
//var db = mongoose.connection

let db = {
      localhost: 'mongodb://localhost:27017/mongo-data-login-reg',
      mlab: 'mongodb://pranav:bhale@ds239988.mlab.com:39988/loginapp'
    };

 mongoose.Promise=global.Promise;
mongoose.connect(db.mlab || db.localhost,{ useMongoClient: true })


var routes = require('./routes/index')
var users = require('./routes/users')
var fb = require('./routes/fb')
var google = require('./routes/google')
var git = require('./routes/git')



var User = require("./models/user.js")
//var FbUser = require("./models/fbuser.js")



//console.log(users);
console.log(fb);

var app = express()

//express-handlebars configs
app.set('views',path.join(__dirname,'views'))
app.engine('handlebars', exphbs({defaultLayout: 'layouts'}));
app.set('view engine', 'handlebars');

//bodyParser configs
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())

//static folder
app.use(express.static(path.join(__dirname,'public')))

// session configs
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  //cookie: { secure: true }
}))


//passport config
app.use(passport.initialize());

app.use(passport.session());


//express Validatior

app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//Flash config
debugger
app.use(flash())

app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});


//facebook

var FACEBOOK_APP_ID = 1172013476269357
var FACEBOOK_APP_SECRET = "ae7912916307824da9ec92d5f55e7bea"

passport.use(new FacebookStrategy({
    clientID:     FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    passReqToCallback   : true,
    profileFields: ['id', 'displayName', 'email']
  },
  function(request, accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      User.findOne({'email': profile.emails[0].value}, function (err, user) {
      //  return cb(err, user);
      if(err){
        return done(err)
      }

      if(user){
        return done(null,user)
      }else {
        var user = new User()
        user.username = profile.emails[0].value;
        user.token = accessToken;
      //  user.googleprofileUrl = profile.profileUrl;
      //  user.google.email = profile.emails[0].value;
        user.facebookId = profile.id;
      //  user.google.displayName = profile.displayName;
      ///  user.firstname =profile.name.givenName;
      //  user.lastname=profile.name.familyName;

        user.save(function (err) {
          console.log(err);

          if(err) throw err

          return done(null,user)
        })
      }
      });
    });
  }
));


//google login

var GOOGLE_CLIENT_ID = "974836680990-iq66d73c40qer5m988mdlfs08mc3cmbo.apps.googleusercontent.com"
var GOOGLE_CLIENT_SECRET = "qExfO3ClpnyEq5_LrFyZu95C"

passport.use(new GoogleStrategy({
    clientID:     GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback",
    passReqToCallback   : true,
    profileFields: ['id', 'displayName', 'email']
  },
  function(request, accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      User.findOne({'email': profile.emails[0].value}, function (err, user) {
      //  return cb(err, user);
      if(err){
        return done(err)
      }

      if(user){
        return done(null,user)
      }else {
        var user = new User()
        user.username = profile.emails[0].value;
      //  user.google.token = accessToken;
      //  user.googleprofileUrl = profile.profileUrl;
      //  user.google.email = profile.emails[0].value;
        user.googleId = profile.id;
      //  user.google.displayName = profile.displayName;
      ///  user.firstname =profile.name.givenName;
      //  user.lastname=profile.name.familyName;

        user.save(function (err) {
          console.log(err);

          if(err) throw err

          return done(null,user)
        })
      }
      });
    });
  }
));

//github

var git_ClientId = "4e68442f9fd02467482d"
var git_SecretId = "68f96f33402eebfa9b2eb3067514be7ff2522df1"


passport.use(new GitHubStrategy({
    clientID:     git_ClientId,
    clientSecret: git_SecretId,
    callbackURL: "http://localhost:3000/auth/github/callback",
    passReqToCallback   : true,
    profileFields: ['id', 'displayName', 'email']
  },
  function(request, accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      User.findOne({'email': profile.emails[0].value}, function (err, user) {
      //  return cb(err, user);
      if(err){
        return done(err)
      }

      if(user){
        return done(null,user)
      }else {
        var user = new User()
        user.username = profile.emails[0].value;
      //  user.google.token = accessToken;
      //  user.googleprofileUrl = profile.profileUrl;
      //  user.google.email = profile.emails[0].value;
        user.gitId = profile.id;
      //  user.google.displayName = profile.displayName;
      ///  user.firstname =profile.name.givenName;
      //  user.lastname=profile.name.familyName;

        user.save(function (err) {
          console.log(err);

          if(err) throw err

          return done(null,user)
        })
      }
      });
    });
  }
));


passport.serializeUser(function(user, done){
done(null, user._id);
});
passport.deserializeUser(function(id, done){
User.findById(id, function(err, user){
if(err || !user) return done(err, null);
done(null, user);
});
});



app.use('/',routes)
app.use('/users',users)
app.use('/',fb)
app.use('/',google)
app.use('/',git)




// app.get('/',(req,res)=>{
//   res.send('Hello')
// })

var port = process.env.PORT || 3000

app.listen(port,()=>{
  console.log(`server is hosted on ${port}`);
})
