const request = require('request');
const DepositModel = require('../models/Deposit');
const UserModel = require('../models/User');
const generateId = require('uniqid');
let depositUrl = '/deposit/';


module.exports = function (router) {

    // user deposits
    router.post(depositUrl, function (req, res) {
        UserModel.findOne({ email: req.body.user.email }, function (error, user) {
            var url = "https://api.gamerpay.com/merchants/v1/payments?access_token=f898c80e-2e90-4c08-9011-e9b9e22a2e1e"
            var depositData = req.body.deposit
            depositData.transactionId = generateId()
            if (user) {
                request({ method: 'POST', uri: url, json: depositData }, function (error, response, body) {
                    if (response.statusCode == 200) {
                        depositData.userId = req.body.user._id
                        var depositObject = new DepositModel(depositData)
                        depositObject.save(function (error, deposit){
                            user.oldBalance = user.balance
                            user.balance += deposit.amount
                            user.save(function (err, user) {
                                res.status(200).json(body)
                            });
                        })
                    } else {
                        res.status(response.statusCode).json(response)
                    }
                });
            } else {
                res.status(420).json({ message: "Email not found" })
            }
        })
    });

    // Update a deposits
    router.post(depositUrl + 'success', function (req, res) {
        DepositModel.find({ transactionId: req.body.transaction_id }, function (err, depositObject) {
            if (err) {
                res.json({ info: 'error during find case', error: err });
            };
            if (depositObject) {
                depositObject.success = true
                depositObject.save(function(error, deposit){
                    UserModel.findOne({ _id: doc.userId }, function (error, userObject){
                        userObject.oldBalance = userObject.balance
                        userObject.balance += deposit.amount
                        userObject.save(function (err, user) {
                            res.status(200).json(userObject)
                        });
                    })
                })
            } else {
                res.json({ info: 'case not found' });
            }
        });
    });

    router.post(depositUrl + 'failure', function (req, res) {
        DepositModel.find({ transactionId: req.body.transaction_id }, function (err, depositObject) {
            if (err) {
                res.json({ info: 'error during find case', error: err });
            };
            if (depositObject) {
                depositObject.success = true
                depositObject.save(function (error, deposit) {
                    UserModel.findOne({ _id: doc.userId }, function (error, userObject) {
                        userObject.oldBalance = userObject.balance
                        userObject.balance += deposit.amount
                        userObject.save(function (err, user) {
                            res.status(200).json(userObject)
                        });
                    })
                })
            } else {
                res.json({ info: 'case not found' });
            }
        });
    });
};