let winningUrl = '/winning/';
const Items = require('../models/Item');
const Winnings = require('../models/Winning');


module.exports = function (router) {

    // Get all items won by a specific user
    router.post('/user/winning', function (req, res) {
        Winnings.find({ user_id: req.body.user_id, sold: false, withdrawn: false }, { roundSecret: 0, ticketNumber: 0, clientHash: 0, outcomeId: 0, sold: 0, withdrawn: 0 } ).populate('item').exec().then(unsold => {
            Winnings.find({ user_id: req.body.user_id, sold: true }, { roundSecret: 0, ticketNumber: 0, clientHash: 0, outcomeId: 0, sold: 0, withdrawn: 0 }).populate('item').exec().then(sold => {
                Winnings.find({ user_id: req.body.user_id, withdrawn: true }, { roundSecret: 0, ticketNumber: 0, clientHash: 0, outcomeId: 0, sold: 0, withdrawn: 0 }).populate('item').exec().then(withdrawn => {
                    res.status(200).json({
                        sold_items: sold,
                        unsold_items: unsold,
                        withdrawn_items: withdrawn
                    })
                })
            })
        })
    });

    // Get all items won from a specific case
    router.post('/case/winning', function (req, res) {
        Winnings.find({ case_id: req.body.case_id }, { roundSecret: 0, ticketNumber: 0, clientHash: 0, outcomeId: 0 }).limit(12).populate('item').exec().then(docs => {
            res.status(200).json(docs)
        })
    });
};