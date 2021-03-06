var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
//var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({

  username:{
    type:String,
  //  required:true
  },

  name:{
    type:String,
  //  required:true
  },

  mobile:{
    type:String,
    unique:true,
    maxlength: 10
  },

  dob:{
    type:Date,
  },

  email:{
    type:String,
  //  unique:true,
  //  required:true
  },

  password:{
    type: String,
//   required: true
 },

 googleId: String,

 facebookId:String,

 gitId:String,

 token:String
})



//UserSchema.plugin(passportLocalMongoose)

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function (newUser,callback) {
  bcrypt.genSalt(10,function (err,salt) {
    bcrypt.hash(newUser.password,salt,function (err,hash) {
      newUser.password = hash
      newUser.save(callback)
    })
  })
}

module.exports.getUserByUsername = function (username,callback) {
  debugger
  var query = {username:username}
  User.findOne(query,callback)
}


module.exports.getUserById = function (id,callback) {
//  var query = {username:username}
  User.find({id:id},callback)
}

module.exports.comparePassword = function (candidatePassword,hash,callback){
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    debugger
     if(err) throw err

     callback(null,isMatch)
});
}
