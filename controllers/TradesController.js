const User = require('../models/User');
const Trades = require('../models/Trades');
const _ = require('lodash');
const TradesUrl = '/users/:steamId/trades';

//TODO: get steam_id by jwt and remove from `TradesUrl`

module.exports = function (router) {

    // Get all trades of a user
    router.get(TradesUrl, function (req, res) {
        User.findOne({steam_id: req.params.steamId}).exec()
            .then(docs => {
                if (docs) {
                    Trades.find({steam_id: req.params.steamId}).exec()
                        .then(docs => res.status(200)
                            .json(docs))
                        .catch(err => res.status(500)
                            .json({
                                message: 'Error finding trade',
                                error: err
                            }));
                } else {
                    res.status(404)
                        .json({
                            message: 'user not found'
                        });
                }
            })
            .catch(err => {
                res.status(500)
                    .json({
                        message: 'Error finding user',
                        error: err
                    });
            });
    });

    // Get trade by id 
    router.get(`${TradesUrl}:id`, function (req, res) {
        User.findOne({steam_id: req.params.steamId}).exec()
            .then(docs => {
                if (docs) {
                    Trades.findById(req.params.id).exec()
                        .then(docs => res.status(200)
                            .json(docs))
                        .catch(err => res.status(500)
                            .json({
                                message: 'Error finding trade',
                                error: err
                            }));
                } else {
                    res.status(404)
                        .json({
                            message: 'user not found'
                        });
                }
            })
            .catch(err => {
                res.status(500)
                    .json({
                        message: 'Error finding user',
                        error: err
                    });
            });
    });

    // Create a trade
    router.post(TradesUrl, function (req, res) {
        User.findOne({steam_id: req.params.steamId}).exec().exec()
            .then(docs => {
                if (docs) {
                    req.body = {...req.body, steam_id: req.params.steamId};
                    let tradeObject = new Trades(req.body);
                    tradeObject.save(function (err, user) {
                        if (err) return console.log(err);
                        res.status(200).json(user)
                    })
                } else {
                    res.status(404)
                        .json({
                            message: 'user not found'
                        });
                }
            })
            .catch(err => {
                res.status(500)
                    .json({
                        message: 'Error finding user',
                        error: err
                    });
            });
    });

    // Update trade
    router.put(`${TradesUrl}:id`, function (req, res) {
        User.findOne({steam_id: req.params.steamId}).exec().exec()
            .then(docs => {
                if (docs) {
                    if (req.body.steam_id) {
                        res.status(500)
                            .json({
                                message: 'invalid json'
                            });
                    } else {
                        Trades.findById(req.params.id, function (err, TradesObject) {
                            if (err) {
                                res.json({info: 'error during find trade', error: err});
                            }
                            if (TradesObject) {
                                _.merge(TradesObject, req.body);
                                TradesObject.save(function (err) {
                                    if (err) {
                                        res.json({info: 'error during trade update', error: err});
                                    }
                                    ;
                                    res.status(200).json(TradesObject)
                                });
                            } else {
                                res.json({info: 'trade not found'});
                            }
                        });
                    }
                } else {
                    res.status(404)
                        .json({
                            message: 'user not found'
                        });
                }
            })
            .catch(err => {
                res.status(500)
                    .json({
                        message: 'Error finding user',
                        error: err
                    });
            });
    });

    //Delete a trade
    router.delete(`${TradesUrl}:id`, function (req, res) {
        User.findOne({steam_id: req.params.steamId}).exec().exec()
            .then(docs => {
                if (docs) {
                    Trades.findByIdAndDelete(req.params.id).exec()
                        .then(docs => res.status(200)
                            .json(docs))
                        .catch(err => res.status(500)
                            .json({
                                message: 'Error finding users trade',
                                error: err
                            }));
                } else {
                    res.status(404)
                        .json({
                            message: 'user not found'
                        });
                }
            })
            .catch(err => {
                res.status(500)
                    .json({
                        message: 'Error finding user',
                        error: err
                    });
            });
    });
};