const Router = require('express').Router
const validate = require('express-validation');
const highlightIconCtrl = require('../controllers/highlight_icons.controller');

var router = Router()

router.route('/')
  .get(highlightIconCtrl.list);

module.exports = router;
