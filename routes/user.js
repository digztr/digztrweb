const Router = require('express').Router
const userCtrl = require('../controllers/user.controller');

var router = Router();

router.route('/')
  .post(userCtrl.login);

router.route('/register')
  .post(userCtrl.validate_register, userCtrl.register);

router.route('/token')
  .post(userCtrl.getFromToken);

module.exports = router
