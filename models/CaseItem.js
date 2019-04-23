const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CaseItemSchema = new Schema({
    case_id: String,
    percentage: mongoose.Decimal128,
    lrange: mongoose.Decimal128,
    hrange: mongoose.Decimal128,
    market_hash_name: String
});

const CaseItem = mongoose.model('case_item', CaseItemSchema);
module.exports = CaseItem;