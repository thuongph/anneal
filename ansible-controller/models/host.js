const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const host = new Schema({
    name: {
        type: String,
        require: true,
    },
    host: {
        type: String,
        require: true,
    },
    user_name: {
        type: String,
        require: true,
    },
    private_key_file: {
        type: String,
        require: true,
    },
    inventory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inventory',
        require: true,
    }
}, {
    timestamps: true
})

var Host = mongoose.model('Host', host);

module.exports = Host;