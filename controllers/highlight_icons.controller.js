const HighlightIcon = require('../models/icons.model');

/**
 * Get Listing list
 */
function list(req, res, next) {
  HighlightIcon.list()
    .then(icons => res.json(icons))
    .catch(e => next(e));
}

module.exports = {list};
