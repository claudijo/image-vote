var User = require('../models/user');
var Sheet = require('../models/sheet');
var Photo = require('../models/photo');
var config = require('../config');

exports.read = function(req, res, next) {
  User.findById(req.remoteUser._id, function(err, user) {
    if (err) return next(err);
    if (!user) {
      return res.json(404, {message: 'User not found'});
    }

    Sheet.findById(req.params.id, function(err, sheet) {
      if (err) return next(err);
      if (!sheet) {
        return res.json(404, {message: 'Sheet not found'});
      }

      if (!sheet.userId.equals(user._id)) {
        return res.json(403, {message: 'Permission denied'});
      }

      Photo.find({
        _id: {
          $in: sheet.photos
        }
      }, function(err, photos) {
        var done = true;
        photos.forEach(function(photo) {
          if (photo.displayCount < config.requiredVoteCount) {
            done = false;
          }
        });
        if (done) {
          return res.json(200, photos);
        }
        res.send(304);
      });
    });
  });
};

exports.create = function(req, res, next) {
  User.findById(req.remoteUser._id, function(err, user) {
    if (err) return next(err);
    if (!user) {
      return res.json(404, {message: 'User not found'});
    }

    Sheet.findById(req.params.id, function(err, sheet) {
      if (err) return next(err);
      if (!sheet) {
        return res.json(404, {message: 'Sheet not found'});
      }
      if (!sheet.userId.equals(user._id)) {
        return res.json(403, {message: 'Permission denied'});
      }

      Photo.findById(req.body.photoId, function(err, photo) {
        if (err) return next(err);
        if (!photo) {
          return res.json(404, {message: 'Photo not found'});
        }

        // TODO: Make sure we don't supply photos that have already been liked

        if (photo.likedBy.indexOf(user._id) !== -1) {
          return res.json(400, {message: 'Photo already liked by user'});
        }

        photo.likedBy.push(user._id);

        photo.save(function(err) {
          if (err) return next(err);

          sheet.voteCount += 1;
          sheet.save(function(err) {
            if (err) return next(err);

            var votesLeft = config.requiredVoteCount - sheet.voteCount;
            votesLeft = (votesLeft < 0 ? 0 : votesLeft);

            res.send(200, {votesLeft: votesLeft});
          });
        });
      });
    });
  });
};
