const Inquiry = require('../models/inquiries.model');
const { check, validationResult } = require('express-validator/check');

/**
* Add New Inquiry Validator
*/
const validate_create = [
  check('name')
  .isLength({min:1})
  .withMessage('Name is required')
  .trim(),
  check('phone')
  .isLength({min:1})
  .withMessage('Phone is required')
  .trim(),
  check('email')
  .isLength({min:1})
  .withMessage('Email is required')
  .isEmail()
  .withMessage('Must be a valid email')
  .trim(),
  check('message')
  .isLength({min:1})
  .withMessage('Message is required')
  .trim()
];

/**
 * Add New Inquiry
 */
function create(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    res.status(500).json({ errors: errors.mapped() });
  }

  let payload = req.body;
  Inquiry.create(payload)
    .then(inquiry => res.json(inquiry))
    .catch(e => next(e));
}

/**
 * Get Inquiry list
 */
function list(req, res, next) {
  Inquiry.list()
    .then(Inquirys => res.json(Inquirys))
    .catch(e => next(e));
}

/**
 * Get Inquiry by ID
 */
function show(req, res, next) {
  Inquiry.show(req.params.id)
    .then(Inquiry => res.json(Inquiry))
    .catch(e => next(e));
}

module.exports = {create,validate_create,list,show};
