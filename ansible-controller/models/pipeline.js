const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const author = new Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
})

const commit = new Schema({
    id: {
        type: String,
        require: true,
    },
    tree_id: {
        type: String,
        require: true,
    },
    message: {
        type: String,
        require: true,
    },
    url: {
        type: String,
        require: true,
    },
    author: {
      type: author,
      require: true,
    },
    committer: {
      type: author,
      require: true,
    },
    added: {
        type: [String],
        require: false,
    },
    removed: {
        type: [String],
        require: false,
    },
    modified: {
        type: [String],
        require: false,
    },
}, {
    timestamps: true
})

const pipeline = new Schema({
    status: {
        type: String,
        require: require,
    },
    commits: {
        type: [commit],
        require: true,
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