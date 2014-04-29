var User = require('../models/user');
var bcrypt = require('bcrypt');

const SALT_LENGTH = 12;

exports.create = function(req, res, next) {
  var data = req.body;
  User.findOne({email: data.email}, function(err, user) {
    if (err) return next(err);
    if (user) {
      return res.json(409, { message: 'Email already registered'});
    }
    bcrypt.genSalt(SALT_LENGTH, function(err, salt) {
      if (err) return next(err);
      bcrypt.hash(data.password, salt, function(err, hash) {
        if (err) return next(err);
        User.create({
          email: data.email,
          gender: data.gender,
          password: hash,
          salt: salt
        }, function(err, user) {
          if (err) return next(err);
          res.json(201, user);
        });
      });
    });
  });
};


