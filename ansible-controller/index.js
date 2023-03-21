const express = require('express');
const project_router = require('./routes/project');
const pipeline_router = require('./routes/pipeline');
const host_router = require('./routes/host');
const inventory_router = require('./routes/inventory');
const config = require('./config');
const mongoose = require('mongoose');

const connect = mongoose.connect(config.mongoUrl);
const app = express();
const port = 3001;

connect.then((db) => {
  console.log('connected correctly to server');
}, (err) => { console.log(err); });

app.use('/projects', project_router);
app.use('/pipelines', pipeline_router);
app.use('/hosts', host_router);
app.use('/inventories', inventory_router);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
