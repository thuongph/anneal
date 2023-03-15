const express = require('express');

var pipeline_router = express.Router();
pipeline_router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = pipeline_router;