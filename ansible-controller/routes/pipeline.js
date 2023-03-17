const express = require('express');

var pipeline_router = express.Router();
pipeline_router.get('/', function(req, res, next) {
  console.log('--------------------------- pipeline');
});

module.exports = pipeline_router;