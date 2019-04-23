const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ItemSchema = new Schema({
    
    owner: String,
    game: String,
    market_hash_name: String,
    withdrawable: Number,
    demo: Number,
    time: Number,
});

const Item = mongoose.model('item',  ItemSchema);
module.exports = Item;