const express = require('express');

var ci_router = express.Router();
ci_router.get('/', function(req, res, next) {
  console.log('------------------------- ci');
});

module.exports = ci_router;