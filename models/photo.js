var mongoose = require('mongoose');
var config = require('../config');

var Schema = mongoose.Schema;

var getRandCoords = function() {
  return [Math.random(), Math.random()];
}

var createRandomPhotosQuery = function(opts) {
  var query = {
    displayCount: {$lt: config.maxDisplaysPerPhoto},
    gender: opts.preferredGender,
    $and: [{
      userId: {$ne: opts.userId}
    }],
    random: {
      $near: {
        $geometry: {type: 'Point', coordinates: getRandCoords()}
      }
    }
  }

  opts.photos.forEach(function(photo) {
    query.$and.push({
      _id: {$ne: photo._id}
    });
  });

  return query;
};

var photoSchema = new Schema({
  path: {
    type: String,
    required: true
  },
  random: {
    type: {type: String, default: 'Point'},
    coordinates: {
      type: [Number],
      default: getRandCoords
    }
  },
  likedBy: {
    type: [Schema.Types.ObjectId],
    default: []
  },
  displayCount: {
    type: Number,
    default: 0
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true
  }
});

photoSchema.index({random: '2dsphere'});

photoSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    delete ret.__v;
    delete ret.random;
    delete ret.gender;
  }
});

// Inspired by https://github.com/matomesc/mongoose-random/blob/master/index.js
photoSchema.statics.getRandomPhotos = function(opts, fn) {
  opts.photos = opts.photos || [];

  var query = createRandomPhotosQuery(opts);
  var update = { $inc: { displayCount: 1 } };

  mongoose.model('Photo').findOneAndUpdate(query, update, function(err, photo) {
    if (err) return fn(err);
    if (!photo) {
      return fn(null, opts.photos);
    }

    opts.photos.push(photo);

    if (opts.photos.length >= opts.count) {
      return fn(null, opts.photos);
    }

    mongoose.model('Photo').getRandomPhotos(opts, fn);
  });
};

module.exports = mongoose.model('Photo', photoSchema);
