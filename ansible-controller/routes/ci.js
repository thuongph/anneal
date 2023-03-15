const express = require('express');

var ci_router = express.Router();
ci_router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = ci_router;