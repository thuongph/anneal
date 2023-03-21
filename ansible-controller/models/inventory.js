const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const inventory = new Schema({
    name: {
        type: String,
        required: true,
    },
    hosts: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
    }
}, {
    timestamps: true
})

var Inventory = mongoose.model('Inventory', inventory);

module.exports = Inventory;