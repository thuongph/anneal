const express = require('express');
const bodyParser = require('body-parser');
const Pipeline = require('../models/pipeline');
const Project = require('../models/project');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

var pipeline_router = express.Router();

pipeline_router.use(bodyParser.json());

pipeline_router.route('/')
  .get((req, res, next) => {
    console.log('------------------------ get pipelines')
    Pipeline.find({})
      .then((pipelines) => { 
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(pipelines);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    console.log('------------------------ create a pipeline')
    console.log(req.body);
    // check whether project is valid
    Project.findOne({repo_url: req.body.repository.html_url})
      .then((project) => {
          if (project != null) {
            const newPipeline = {project: project._id, commits: req.body.commits, head_commit: req.body.head_commit, status: 'created'};
            // create new pipeline
            Pipeline.create(newPipeline)
              .then((pipeline) => {
                  console.log('------------------------', pipeline);
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json(pipeline);
                  // run ansible script
                  runAnsibleScript(pipeline, project);
              }, (err) => next(err))
              .catch((err) => next(err));
          } else {
              err = new Error('Project ' + req.body.html_url + ' not found');
              err.status = 404;
              return next(err);
          }
      }, (err) => next(err))
      .catch((err) => next(err));
  })

pipeline_router.route('/:pipelineId')
  .get((req, res, next) => {
    console.log('------------------------ get pipeline by id')
    Pipeline.findById(req.params.pipelineId)
        .then((pipeline) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(pipeline);
        }, (err) => next(err))
        .catch((err) => next(err));
  })
  .delete((req, res, next) => {
    Pipeline.findByIdAndRemove(req.params.pipelineId)
      .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
      }, (err) => next(err))
      .catch((err) => next(err));
  })

const runAnsibleScript = async (pipeline, project) => {
  console.log('---------------------------- run ansible script');
  var ansible_cmd = 'ANSIBLE_CONFIG=/etc/ansible/ansible.cfg /usr/bin/ansible-playbook -i /home/teko/anneal/ci-template/nodejs-template/inventory.txt /home/teko/anneal/ci-template/nodejs-template/playbook.yaml --extra-vars "use_standard_ci=' + project.ci_circle.use_standard_ci + ' project_id=' + project._id + ' git_commit_head=' + pipeline.head_commit.id + '"';
  await exec(ansible_cmd, (err, stdout, stderr) => {
    console.log('-------------------------- stdout >>', stdout);
    // get number of fail job
    const play_recap = stdout.slice(stdout.indexOf('PLAY RECAP') + 1);
    const _play_recap = play_recap.slice(play_recap.indexOf('failed=') + 1);
    const fail = parseInt(_play_recap.slice(_play_recap.indexOf('=') + 1, _play_recap.indexOf(' ')));
    console.log('------------------------- fail >>', fail)
    // update pipeline status as playbook result
    if (fail > 0) {
      // case pipeline fail --> update status
      Pipeline.findByIdAndUpdate(pipeline._id, {status: "fail"}, { new: true })
        .then((pipeline) => {
          console.log(pipeline);
        }, (err) => next(err))
        .catch((err) => next(err));
    }
    if (fail == 0) {
      Pipeline.findByIdAndUpdate(pipeline._id, {status: "success"})
        .then((pipeline) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(pipeline);
        }, (err) => next(err))
        .catch((err) => next(err));
    }
  });
}

module.exports = pipeline_router;