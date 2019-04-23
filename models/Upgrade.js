const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UpgradeSchema = new Schema({
    
    name: String,
    steam_id: String,
    from_name: String,
    from_image: String,
    to_name: String,
    from_price: mongoose.Decimal128,
    to_price: mongoose.Decimal128,
    chance: mongoose.Decimal128,
    percentage: mongoose.Decimal128,
    to_image: String,
    roll: String,
    result: Number,
    hash: String,
    secret: String,
    demo: Number,
    time: Number

});

const Upgrade = mongoose.model('upgrade',  UpgradeSchema);
module.exports = Upgrade;