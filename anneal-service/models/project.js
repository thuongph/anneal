const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const job = new Schema({
    name: {
        type: String,
        required: true,
    },
    command: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
})

const stage = new Schema({
    name: {
        type: String,
        required: true,
    },
    jobs: {
        type: [job],
        required: true,
    },
}, {
    timestamps: true
})

const project = new Schema({
    name: {
        type: String,
        required: true,
        unique : true,
    },
    inventory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inventory',
        required: true,
    },
    repo_url: {
        type: String,
        required: true,
        unique : true,
    },
    stack: {
        type: String,
        required: true,
    },
    stages: {
        type: [stage],
        required: false,
    },
    active: {
        type: Boolean,
        required: true,
        default: true,
    }
}, {
    timestamps: true
})

var Project = mongoose.model('Project', project);

module.exports = Project;