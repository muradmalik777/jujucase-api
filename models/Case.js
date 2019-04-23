const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let CaseSchema = new Schema({
    name: {
        type: String,
        default: "name"
    },
    price: mongoose.Decimal128 ,
    tax: mongoose.Decimal128 ,
    affiliateCut: mongoose.Decimal128 ,
    creator: String,
    opened: Number,
    opened1d: Number,
    opened7d: Number,
    opened2w:Number,
    case_image: String,
    skin_image: String,
    type: String,
    game: String,    
    code: String,
    featured: Number,
    bid_place:  Number,
    bid_amount: mongoose.Decimal128 ,
    bid_time:  Number,
    created: Number,
    invalid: Number,
    last_update:  Number,
    avatar:  String,
    steam_id: Number

});

const Case = mongoose.model('Case', CaseSchema);
module.exports = Case;