const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let CaseSchema = new Schema({
    name: {
        type: String,
        default: "name"
    },
    price: Number,
    slug: String,
    spinDuration: String,
    status: String,
    tags: [
        {
            type: String
        }
    ],
    tax: Number,
    affiliateCut: Number,
    creator: String,
    openCount: Number,
    caseHash: String,
    opened1d: Number,
    opened7d: Number,
    opened2w: Number,
    case_image: String,
    skin_image: String,
    type: {
        type: String,
        default: "User Created"
    },
    game: String,
    code: String,
    featured: Number,
    bid_place: Number,
    bid_amount: mongoose.Decimal128,
    bid_time: Number,
    created: Number,
    invalid: Number,
    last_update: Number,
    avatar: String,
    user_id: String,
    items: [
        {
            type: Schema.Types.ObjectId,
            ref: 'CaseItem' 
        }
    ]
});

const Case = mongoose.model('Case', CaseSchema);
module.exports = Case;