const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let StockSchema = new Schema({
    
    asset_id: String,
    bot_id: Number,
    market_hash_name: String,
    game: String,
    time: Number
});

const Stock = mongoose.model('stock',  StockSchema);
module.exports = Stock;