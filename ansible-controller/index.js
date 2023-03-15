const express = require('express');
const app = express();
const port = 3001;
const router = require('./routes/index');
const ci_router = require('./routes/ci');
const pipeline_router = require('./routes/pipeline')

app.use('/', router);
app.use('/ci', ci_router);
app.use('/pipeline', pipeline_router);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
