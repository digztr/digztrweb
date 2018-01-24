const listing_header_images = require('./listing_header_images');
const icons = require('./icons.model');
const highlight_icons = require('./highlight_icons.model');
const agents = require('./agent.model');
const users = require('./user.model');
const  mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

/**
 * Listing Schema
 */
const ListingSchema = new mongoose.Schema({
  name: {
    type: String,
    require: false
  },
  price: {
    type: Number,
    require: false
  },
  description: {
    type: String,
    require: false
  },
  meta: {
    type: [],
    require: false
  },
  nearbyHomes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'listings'
  }],
  headerImages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'listing_header_images'
  }],
  features: [{
    icon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'highlight_icons',
      require: false
    },
    name: {
      type: String,
      require: false
    },
    value: {
      type: String,
      require: false
    }
  }],
  facts: [{
    icon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'icons',
      require: false
    },
    type: {
      type: String,
      require: false
    },
    value: {
      type: String,
      require: false
    }
  }],
  agents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'agents'
  }],
  mlsId: {
    type: Number,
    require: false
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  interiors: [{
    type: {
      type: String,
      require: true
    },
    values: [{
      type: String,
      require: true
    }]
  }],
  construction: [{
    type: {
      type: String,
      require: true
    },
    values: [{
      type: String,
      require: true
    }]
  }]
});

/**
 * Methods
 */
ListingSchema.method({
});

/**
 * Statics
 */
ListingSchema.statics = {
  /**
  * List all listings
  */
  list() {
    return this.find()
    .populate('nearbyHomes')
    .populate('headerImages')
    .populate('features.icon')
    .populate('facts.icon')
    .populate('agents')
    .populate('users')
    .exec();
  },
  /**
  * List all listings
  */
  show(id) {
    return this.findById(id)
    .populate('nearbyHomes')
    .populate('headerImages')
    .populate('features.icon')
    .populate('facts.icon')
    .populate('agents')
    .populate('users')
    .exec();
  },
  /**
  * Get Listing By MLS No.
  */
  get_by_mls(id) {
    return this.findOne({"mlsId":id})
    .populate('features.icon')
    .populate('users')
    .exec();
  }
}

module.exports = mongoose.model('listings', ListingSchema);
