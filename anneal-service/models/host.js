const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const host = new Schema({
    name: {
        type: String,
        required: true,
        unique : true,
    },
    host: {
        type: String,
        required: true,
        unique : true,
    },
    user_name: {
        type: String,
        required: true,
    },
    private_key_file: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
})

var Host = mongoose.model('Host', host);

module.exports = Host;