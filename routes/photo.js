var tmp = require('tmp');
var mkdirp = require('mkdirp');
var path = require('path');
var Photo = require('../models/photo');
var User = require('../models/user');
var fs = require('fs');

exports.random = function(req, res, next) {
  var count = parseInt(req.query.count) || 2;

  User.findById(req.remoteUser._id, function(err, user) {
    if (err) return next(err);
    if (!user) {
      return res.json(404, {error: 'User not found'});
    }

    var preferredGender = (user.gender === 'female' ? 'male' : 'female');

    Photo.getRandomPhotos({
      count: count,
      preferredGender: preferredGender,
      userId: user._id
    }, function(err, photos) {
      if (err) return next(err);

      res.json(200, photos);
    });
  });
};

exports.create = function(photosFullDir, photosPublicDir) {
  return function(req, res, next) {
    User.findById(req.remoteUser._id, function(err, user) {
      if (err) return next(err);
      if (!user) {
        return res.json(404, {error: 'User not found'});
      }

      var img = req.files.photo;
      var userDir = path.join(photosFullDir, user.id);

      if(!img.size) {
        res.send(400, {error: 'Missing image'});
      }

      mkdirp(userDir, function(err) {
        if (err) return next(err);

        tmp.tmpName({
          dir: userDir,
          prefix: 'photo-',
          postfix: path.extname(img.name),
          keep: true
        }, function(err, destPath) {
          if (err) return next(err);

          fs.rename(img.path, destPath, function(err) {
            if (err) return next(err);

            Photo.create({
              path: path.join(photosPublicDir, user.id, path.basename(destPath)),
              userId: user._id,
              gender: user.gender
            }, function(createError, photo) {
              if (createError) {
                fs.unlink(destPath, function(unlinkError) {
                  if (unlinkError) return next(unlinkError);

                  next(createError);
                });
              } else {
                res.send(201, photo);
              }
            });
          });
        });
      });
    });
  };
};

exports.form = function(req, res){
  res.render('photos/upload', {
    title: 'Upload'
  });
};
