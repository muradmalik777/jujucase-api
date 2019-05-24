var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var WinningSchema = new Schema({
    user_id: String,
    case_id: String,
    clientHash: String,
    outcomeId: String,
    roundSecret: String,
    ticketNumber: Number,
    winningItem: String,
    time: { type: Date, default: Date.now }
});

const Winning = mongoose.model('Winning', WinningSchema);
module.exports = Winning;