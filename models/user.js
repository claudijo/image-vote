var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var Schema = mongoose.Schema;

var userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true
  }
});


userSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    delete ret.password;
    delete ret.salt;
    delete ret.created;
    delete ret.__v;
  }
});

userSchema.statics.authenticate = function(email, password, fn) {
  mongoose.model('User').findOne({email: email}, function(err, user) {
    if (err) return fn(err);
    if (!user) return fn();
    bcrypt.hash(password, user.salt, function(err, hash) {
      if (err) return fn(err);
      if (hash === user.password) return fn(null, user);
      fn();
    });
  });
};

module.exports = mongoose.model('User', userSchema);
