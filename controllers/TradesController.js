const User = require('../models/User');
const Winnings = require('../models/Winning');
const Trade = require('../models/Trade');

const TradeUrl = '/user/trade';

//TODO: get steam_id by jwt and remove from `TradesUrl`

module.exports = function (router) {
    router.post(TradeUrl, function (req, res) {
        Winnings.findOne({ _id: req.body._id, sold: false }).exec().then(winningItem => {
            if(winningItem){
                User.findOne({ _id: req.body.user_id }).exec().then(userData => {
                    userData.balance = userData.balance + req.body.item.price
                    winningItem.sold = true
                    var tradeObject = new Trade(createTrade(req))
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
};

function createTrade(request){
    let data = {}
    data.item = request.body
    return data
}