const User = require('../models/User');
const Winnings = require('../models/Winning');
const Trade = require('../models/Trade');
const request = require('request');

const TradeUrl = '/user/trade/';

//TODO: get steam_id by jwt and remove from `TradesUrl`

module.exports = function (router) {

    router.post(`${TradeUrl}sell`, function (req, res) {
        Winnings.findOne({ _id: req.body._id, sold: false }).exec().then(winningItem => {
            if(winningItem){
                User.findOne({ _id: req.body.user_id }).exec().then(userData => {
                    userData.balance = userData.balance + req.body.item.price
                    winningItem.sold = true
                    var tradeObject = new Trade(createTrade(req))
                    tradeObject.tradeReason = "item sold"
                    tradeObject.save(function(error, tradeData){
                        userData.save(function (error, updatedUser) {
                            winningItem.save(function (error, updatedIWinning) {
                                res.status(200).json({
                                    user: updatedUser,
                                    success: true
                                })
                            })

                        })
                    })
                })
            } else{
                res.status(420).json({
                    message: "Item sold already"
                })
            }
        })
    });

    router.post(`${TradeUrl}withdraw`, function (req, res) {
        Winnings.findOne({ _id: req.body._id, user_id: req.body.user_id, withdrawn: false, sold: false }).exec().then(winningItem => {
            if (winningItem) {
                const url = "https://api.skingifts.com/orders/v1/purchase/" + encodeURI(req.body.item.marketHashName) + "?apiKey=670706c3-f223-414b-b748-d47dc6f40527"
                request({ method: 'GET', uri: url }, function (error, response, body) {
                    console.log(response)
                    if (response.statusCode == 200) {
                        var resp = JSON.parse(body)
                        winningItem.withdrawn = true
                        winningItem.voucherCode = resp.code
                        winningItem.withdrawlUrl = "https://www.skingifts.com/" + resp.code
                        var tradeObject = new Trade(createTrade(req))
                        tradeObject.tradeReason = "item withdrawn"
                        tradeObject.save(function (error, tradeData) {
                            winningItem.save(function (error, updatedWinning) {
                                res.status(200).json({
                                    success: true,
                                    url: updatedWinning.withdrawlUrl
                                })
                            })
                        })
                    } else {
                        res.status(response.statusCode).json({ message: "Item not Available" })
                    }
                });
            } else {
                res.status(420).json({
                    message: "Item withdrawn already"
                })
            }
        })
    });
};

function createTrade(request){
    let data = {}
    data.item = request.body
    return data
}