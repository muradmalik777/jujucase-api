let winningUrl = '/winning/';
const Items = require('../models/Item');
const Winnings = require('../models/Winning');
const Case = require('../models/Case');
const request = require('request');


module.exports = function (router) {

    // Get all items won by a specific user
    router.post('/user/winning', function (req, res) {
        Winnings.find({ user_id: req.body.user_id, sold: false, withdrawn: false }, { sold: 0, withdrawn: 0 } ).populate('item').exec().then(unsold => {
            Winnings.find({ user_id: req.body.user_id, sold: true }, { sold: 0, withdrawn: 0 }).populate('item').exec().then(sold => {
                Winnings.find({ user_id: req.body.user_id, withdrawn: true }, { sold: 0, withdrawn: 0 }).populate('item').exec().then(withdrawn => {
                    res.status(200).json({
                        sold_items: sold,
                        unsold_items: unsold,
                        withdrawn_items: withdrawn
                    })
                })
            })
        })
    });

    router.post('/winning/verify', function (req, res) {
        Case.findOne({ _id: req.body.case_id }).populate('items').exec().then(docs => {
            var data = inputData(docs.items, req.body.clientHash, req.body.roundSecret)
            let url = "http://pandorarng.azurewebsites.net/outcomes/v1/verify"
            request({ method: 'POST', uri: url, json: data }, function (error, response, body) {
                if (response.statusCode == 200) {
                    res.status(200).json(body)
                } else {
                    res.status(response.statusCode).json("server error")
                }
            });
        })
    });

    // Get all items won from a specific case
    router.post('/case/winning', function (req, res) {
        Winnings.find({ case_id: req.body.case_id }, { roundSecret: 0, ticketNumber: 0, clientHash: 0, outcomeId: 0 }).limit(12).populate('item').exec().then(docs => {
            res.status(200).json(docs)
        })
    });
};

function inputData(items, hash, secret) {
    let data = {
        clienHash: hash,
        roundSecret: secret,
        drops: dropsData(items)
    }
    return data
}


function dropsData(items) {
    let drops = []
    items.forEach(item => {
        let data = {}
        data.name = item.marketHashName,
        data.value = item.price
        data.rate = item.odds / 100
        drops.push(data)
    });
    return drops
}