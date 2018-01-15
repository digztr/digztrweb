const  mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

/**
 * Listing Schema
 */
const HighlightIconSchema = new mongoose.Schema({
  icon: {
    type: String,
    require: true
  },
  url: {
    type: String,
    require: true
  }
});

/**
 * Methods
 */
HighlightIconSchema.method({
});

/**
 * Statics
 */
HighlightIconSchema.statics = {
  /**
  * List all listings
  */
  list() {
    return this.find()
    .exec();
  }
}

module.exports = mongoose.model('highlight_icons', HighlightIconSchema);
