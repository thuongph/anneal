const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const host = new Schema({
    name: {
        type: String,
        required: true,
    },
    host: {
        type: String,
        required: true,
    },
    user_name: {
        type: String,
        required: true,
    },
    private_key_file: {
        type: String,
        required: true,
    },
    inventory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inventory',
    }
}, {
    timestamps: true
})

var Host = mongoose.model('Host', host);

module.exports = Host;