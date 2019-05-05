const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ItemSchema = new Schema({
    marketHashName: String,
    appId: String,
    contextId: String,
    iconUrl: String,
    itemColor: String,
    rarityColor: String,
    description: String,
    firstSeen: String,
    price: Number,
    isSafePrice: Boolean
});

const Item = mongoose.model('items',  ItemSchema);
module.exports = Item;