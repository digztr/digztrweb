const Schedule = require('../models/tour_schedules.model');
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
 * Add New Schedule
 */
function create(req, res, next) {
  let payload = req.body;
  console.log(payload);
  Schedule.create(payload)
    .then(Schedule => res.json(Schedule))
    .catch(e => next(e));
}

/**
 * Get Schedule list
 */
function list(req, res, next) {
  Schedule.list()
    .then(Schedules => res.json(Schedules))
    .catch(e => next(e));
}

/**
 * Get Schedule by ID
 */
function show(req, res, next) {
  Schedule.show(req.params.id)
    .then(Schedule => res.json(Schedule))
    .catch(e => next(e));
}

module.exports = {validate_create,create,list,show};
