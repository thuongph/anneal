const Queue = require('bull');
const Ansible = require('node-ansible');
const Pipeline = require('../models/pipeline');
const ansibleQueue = new Queue('execute ansible-playbook');
const fs = require('fs/promises');
const Host = require('../models/host');
const Inventory = require('../models/inventory');

const typeDirMap = {
    JS: {
        playbook_dir: '/home/teko/anneal/ci-template/nodejs-template/playbook',
        inventory_dir: '/home/teko/anneal/ci-template/nodejs-template/inventory/',
    },
    Other: {
        playbook_dir: '/home/teko/anneal/ci-template/any-template/playbook',
        inventory_dir: '/home/teko/anneal/ci-template/any-template/inventory/',
    }
}

const runPipeline = async (pipeline, project) => {
    var playbook;
    if (project.type === 'Khác') {
    playbook = new Ansible.Playbook()
        .inventory(`${typeDirMap.Other.inventory_dir}${project.inventory}.txt`)
        .playbook(typeDirMap.Other.playbook_dir)
        .variables({ use_standard_ci: project.use_standard_ci, project_id: project._id,  git_commit_head: pipeline.head_commit.id, log_dir: `/home/teko/anneal/logs/${pipeline._id}.json`, host_name: getRandomHost(project.inventory)});
    }
    if (project.type === 'JS') {
    const host_name = await getRandomHost(project.inventory);
    console.log('----------------------');
    console.log({host_name});
    playbook = new Ansible.Playbook()
        .inventory(`${typeDirMap.JS.inventory_dir}${project.inventory}.txt`)
        .playbook(typeDirMap.JS.playbook_dir)
        .variables({ use_standard_ci: project.use_standard_ci, project_id: project._id,  git_commit_head: pipeline.head_commit.id, log_dir: `/home/teko/anneal/logs/${pipeline._id}.json`, host_name: host_name});
    }    

    var promise = playbook.exec();
    promise.then(async function(successResult) {
        console.log(successResult);
        const result = await getResultPipeline(pipeline._id);
        Pipeline.findByIdAndUpdate(pipeline._id, {status: "pass", result: result}, { new: true })
            .then((pipeline) => {
                console.log(pipeline);
            }, (err) => next(err))
            .catch((err) => next(err));
    }, async function(error) {
        console.log(error);
        const result = await getResultPipeline(pipeline._id);
        Pipeline.findByIdAndUpdate(pipeline._id, {status: "fail", result: result}, { new: true })
            .then((pipeline) => {
                console.log(pipeline);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
}

const getResultPipeline = async (pipelineId) => {
    try {
        const _result = await fs.readFile(`/home/teko/anneal/logs/${pipelineId}.json`);
        const result = JSON.parse(_result);
        return result.results;
    } catch (err) {
        console.log(err);
    }
}

const getRandomHost = async (inventoryId) => {
    try {
        const inventory = await Inventory.findById(inventoryId);
        const hosts = await Host.find({_id: {
            $in: inventory.hosts
        }});
        const host = hosts[getRandomInt(hosts.length)];
        return host.name;
    } catch (err) {
        console.log(err);
    }
}

const getRandomInt= (max) => {
    return Math.floor(Math.random() * max);
  }

ansibleQueue.process(async (job, done) => {
    try {
        const { pipeline, project } = job.data;
        await runPipeline(pipeline, project);
        done();
    } catch (err) {
        done(new Error('error when execute ansible'));
    }
});

module.exports = ansibleQueue;

