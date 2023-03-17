const express = require('express');
const app = express();
const port = 3001;
const router = require('./routes/index');
const ci_router = require('./routes/ci');
const pipeline_router = require('./routes/pipeline')
const config = require('./config');
const mongoose = require('mongoose');

const connect = mongoose.connect(config.mongoUrl);

connect.then((db) => {
  console.log('connected correctly to server');
}, (err) => { console.log(err); });

app.use('/', router);
app.use('/ci', ci_router);
app.use('/pipeline', pipeline_router);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
