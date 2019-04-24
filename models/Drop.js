const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let DropSchema = new Schema({
    name: String,
    steam_id: String,
    game: String,
    case_name: String,
    case_id: String,
    case_price: mongoose.Decimal128,
    case_image: String,
    drop_name: String,
    drop_price: mongoose.Decimal128,
    drop_image: String,
    hash: String,
    secret: String,
    time: Number
});

const Drop = mongoose.model('drop',  DropSchema);
module.exports = Drop;