var tmp = require('tmp');
var mkdirp = require('mkdirp');
var ncp = require('ncp').ncp;
var path = require('path');
var Photo = require('../models/photo');
var User = require('../models/user');
var fs = require('fs');

exports.random = function(req, res, next) {
  var count = parseInt(req.query.count) || 2;

  User.findById(req.remoteUser._id, function(err, user) {
    if (err) return next(err);
    if (!user) {
      return res.json(404, {message: 'User not found'});
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
        return res.json(404, {message: 'User not found'});
      }

      var img = req.files.photo;
      var userDir = path.join(photosFullDir, user.id);

      if(!img.size) {
        res.json(400, {message: 'Missing photo'});
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

          ncp(img.path, destPath, function(err) {
            if (err) return next(err);

            Photo.create({
              path: path.join(photosPublicDir, user.id, path.basename(destPath)),
              userId: user._id,
              gender: user.gender
            }, function(err, photo) {
              // Remove all uploaded tmp files.
              var filePath;
              for (var file in req.files) {
                if (req.files.hasOwnProperty(file)) {
                  filePath = req.files[file].path;
                  fs.unlink(filePath, function(err) {
                    if (err) {
                      console.error('Error deleting file', filePath, err);
                    }
                  });
                }
              }

              if (err) return next(err);

              res.send(201, photo);
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
