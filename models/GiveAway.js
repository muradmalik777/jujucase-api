const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let GiveAwaySchema = new Schema({
    item: String,
    price: mongoose.Decimal128,
    deposit: mongoose.Decimal128,
    image: String,
    game: String,
    expire: Number
});

const GiveAway = mongoose.model('giveaway',  GiveAwaySchema);
module.exports = GiveAway;