var User = require('../models/user');
var Sheet = require('../models/sheet');
var Photo = require('../models/photo');
var config = require('../config');

exports.create = function(req, res, next) {
  User.findById(req.remoteUser._id, function(err, user) {
    if (err) return next(err);
    if (!user) {
      return res.json(404, {message: 'User not found'});
    }

    if (!Array.isArray(req.body.photoIds)) {
      return res.json(400, {message: 'Missing photos'});
    }

    if (req.body.photoIds.length < config.minPhotosPerSheet) {
      return res.json(400, {message: 'Minimum of ' + config.minPhotosPerSheet +
          ' photos must be provided'});
    }

    Photo.find({
      _id: {
        $in: req.body.photoIds
      }
    }, function(err, photos) {
      if (err) return next(err);
      if (photos.length < req.body.photoIds.length) {
        return res.json(400, {message: 'Missing photo'});
      }

      Sheet.create({
        userId: user._id,
        photos: photos
      }, function(err, sheet) {
        if (err) return next(err);
        res.json(201, sheet);
      });
    });
  });
};
