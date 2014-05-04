var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sheetSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  voteCount: {
    type: Number,
    default: 0
  },
  photos: {
    type: [Schema.Types.ObjectId],
    required: true
  }
});

sheetSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    delete ret.__v;
  }
});

module.exports = mongoose.model('Sheet', sheetSchema);
