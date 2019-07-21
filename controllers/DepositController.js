const request = require('request');
const DepositModel = require('../models/Deposit');
const UserModel = require('../models/User');
const generateId = require('uniqid');
require('dotenv').config();
let depositUrl = '/deposit/';


module.exports = function (router) {

    // user deposits
    router.post(depositUrl, function (req, res) {
        UserModel.findOne({ email: req.body.user.email }, function (error, user) {
            var url = "https://api.gamerpay.com/merchants/v1/payments?access_token=521ef2bf-94dd-4341-9cb6-9aa2fba3705f"
            var depositData = prepareData(req.body.deposit.amount)
            if (user) {
                request({ method: 'POST', uri: url, json: depositData}, function (error, response, body) {
                    if (response.statusCode == 200) {
                        depositData.userId = req.body.user._id
                        var depositObject = new DepositModel(depositData)
                        depositObject.save(function (error, deposit){
                            res.status(200).json(body)
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
    router.post('/payment/success', function (req, res) {
        DepositModel.findOne({ transactionId: req.body.transaction_id }).exec().then(depositObject => {
            depositObject.success = true
            depositObject.save(function (error, deposit) {
                UserModel.findOne({ _id: deposit.userId }, function (error, userObject) {
                    userObject.oldBalance = userObject.balance
                    userObject.balance += deposit.amount
                    userObject.save(function (err, user) {
                        res.status(200).json({
                            transaction: deposit,
                            user: userObject
                        })
                    });
                })
            })
        });
    });

    router.post('/payment/failure', function (req, res) {
        DepositModel.findOne({ transactionId: req.body.transaction_id }).exec().then(depositObject => {
            depositObject.success = false
            depositObject.save(function (error, deposit) {
                UserModel.findOne({ _id: deposit.userId }, function (error, userObject) {
                    res.status(200).json({
                        transaction: deposit,
                        user: userObject
                    })
                })
            })
        });
    });
};

function prepareData(amt){
    var data = {}
    data.transactionId = generateId()
    data.amount = amt;
    data.currency = "USD";
    data.description = "Added Funds " + amt;
    data.customValue = "";
    if (process.env.NODE_ENV === 'development') {
        data.successUrl = "http://127.0.0.1:8080/payment/success";
        data.cancelUrl = "http://127.0.0.1:8080/payment/failure";
    } else if (process.env.NODE_ENV === 'test'){
        data.successUrl = "https://test.jujucase.com/payment/success";
        data.cancelUrl = "https://test.jujucase.com/payment/failure";
    } else {
        data.successUrl = "https://jujucase.com/payment/success";
        data.cancelUrl = "https://jujucase.com/payment/failure";
    }

    return data
}