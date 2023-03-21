const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const author = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
})

const commit = new Schema({
    id: {
        type: String,
        required: true,
    },
    tree_id: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    author: {
      type: author,
      required: true,
    },
    committer: {
      type: author,
      required: true,
    },
    added: {
        type: [String],
        required: false,
    },
    removed: {
        type: [String],
        required: false,
    },
    modified: {
        type: [String],
        required: false,
    },
}, {
    timestamps: true
})

const pipeline = new Schema({
    status: {
        type: String,
        required: require,
    },
    commits: {
        type: [commit],
        required: true,
    },
    head_commit: {
        type: commit,
        required: true,
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    }
}, {
    timestamps: true
})

var Pipeline = mongoose.model('Pipeline', pipeline);

module.exports = Pipeline;