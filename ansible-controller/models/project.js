const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const job = new Schema({
    name: {
        type: String,
        require: true,
    },
    command: {
        type: String,
        require: true,
    },
    tags: {
        type: [String],
        require: false,
    },
    status: {
        type: String,
        require: false,
    }
}, {
    timestamps: true
})

const stage = new Schema({
    name: {
        type: String,
        require: true,
    },
    jobs: {
        type: [job],
        require: true,
    },
}, {
    timestamps: true
})

const ci_circle = new Schema({
    type: {
        type: String,
        require: true,
    },
    use_standard_ci: {
        type: Boolean,
        require: true,
    },
    stages: {
        type: [stage],
        required: false,
    }
}, {
    timestamps: true
})

const project = new Schema({
    name: {
        type: String,
        require: true,
    },
    inventory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inventory',
        require: true,
    },
    repo_url: {
        type: String,
        require: true,
        unique : true,
    },
    ci_circle: {
        type: ci_circle,
        require: true,
    }
}, {
    timestamps: true
})

var Project = mongoose.model('Project', project);

module.exports = Project;