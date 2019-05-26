const CaseOpened = require('../models/OpenCase');
let caseOpenedUrl = '/purchase/';
const Users = require('../models/User');
const Cases = require('../models/Case');
const Winnings = require('../models/Winning');
const request = require('request');


module.exports = function (router) {

    // Get all cases opened byt user
    router.get(caseOpenedUrl, function (req, res) {
        var limit = 12
        var totalCount = 0
        CaseOpened.countDocuments().exec().then(count => {
            totalCount = count
            CaseOpened.find().limit(limit).skip((req.query.p - 1) * limit).populate('items').exec()
                .then(docs => res.status(200)
                    .json({
                        "total_count": totalCount,
                        "items": docs
                    }))
                .catch(err => res.status(500)
                    .json({
                        message: 'Error finding Items',
                        error: err
                    }))
        })
    });

    // Create a case
    router.post(caseOpenedUrl, function (req, res) {
        let newCase = req.body;
        let caseOpenedObject = new CaseOpened(newCase);
        Cases.findById(req.body.case_id).populate('items').exec().then(caseFound => {
            Users.findById(req.body.user_id).exec().then(user => {
                if (user.balance >= caseFound.price) {
                    let data = inputData(caseFound.items, req.body.hash)
                    let url = "http://pandorarng.azurewebsites.net/outcomes/v1"
                    request({ method: 'POST', uri: url, json: data }, function (error, response, body) {
                        if (response.statusCode == 200) {
                            let winningObject = new Winnings(winningData(body, req.body.hash, req.body.user_id, req.body.case_id))
                            let win = caseFound.items.find(item => item.marketHashName === body.winningItem)
                            winningObject.item = win
                            winningObject.save(function(error, docs){
                                caseOpenedObject.case = caseFound
                                caseOpenedObject.save()
                                user.balance = user.balance - caseFound.price
                                user.save()
                                res.status(200).json({
                                    purchased: true,
                                    winning: docs,
                                    user: user
                                })
                            })
                        } else {
                            res.status(response.statusCode).json("server error")
                        }
                    });
                } else {
                    res.status(500).json({ message: "Not enough balance to purchase this case" })
                }
            })
        })
    });
};

function winningData(data, hash, user_id, case_id){
    data.clientHash = hash,
    data.user_id = user_id
    data.case_id = case_id
    return data
}

function inputData(items, hash) {
    let data = {
        clienHash: hash,
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
        drops.push(data)
    });
    return drops
}