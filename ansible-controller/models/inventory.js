const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const inventory = new Schema({
    name: {
        type: String,
        require: true,
    },
}, {
    timestamps: true
})

var Inventory = mongoose.model('Inventory', inventory);

module.exports = Inventory;