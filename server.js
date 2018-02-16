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
var FacebookStrategy = require('passport-facebook').Strategy
var mongo = require('mongodb');
var mongoose = require('mongoose');





mongoose.connect('mongodb://localhost/mongo-data-login-reg')
//mongoose.Promise = global.Promise
var db = mongoose.connection



var routes = require('./routes/index')
var users = require('./routes/users')
var fb = require('./routes/fb')

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





// passport.serializeUser(function(user, done){
// done(null, user._id);
// });
// passport.deserializeUser(function(id, done){
// User.findById(id, function(err, user){
// if(err || !user) return done(err, null);
// done(null, user);
// });
// });



app.use('/',routes)
app.use('/users',users)
app.use('/fb',fb)


// app.get('/',(req,res)=>{
//   res.send('Hello')
// })

var port = process.env.PORT || 3000

app.listen(port,()=>{
  console.log(`server is hosted on ${port}`);
})
