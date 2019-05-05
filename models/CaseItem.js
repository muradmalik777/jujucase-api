const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CaseItemSchema = new Schema({
    marketHashName: String,
    appId: String,
    contextId: String,
    iconUrl: String,
    itemColor: String,
    rarityColor: String,
    description: String,
    firstSeen: String,
    price: Number,
    isSafePrice: Boolean,
    odds: {
        type: Number,
        default: 0
    },
    belongsToCase: {
        type: Schema.Types.ObjectId,
        ref: 'Case'
    }
});

const CaseItem = mongoose.model('CaseItem', CaseItemSchema);
module.exports = CaseItem;