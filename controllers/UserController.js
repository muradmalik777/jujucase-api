const request = require('request');
const UserModel = require('../models/User');
const generateId = require('uniqid');
require('dotenv').config();
const bcrypt = require('bcrypt');
const saltRounds = 3;
let userUrl = '/user/';


module.exports = function (router) {

    router.post('/steam', function (req, res) {
        var key = process.env.API_KEY
        var steamid = req.body.id
        var url = 'https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=' + key + '&steamids=' + steamid;
        UserModel.findOne({ steam_id: steamid }, function (err, user) {
            if (user) {
                res.send(user)
            } else {
                request({ method: 'GET', uri: url }, function (error, response, body) {
                    if (response.statusCode == 200) {
                        var steam = JSON.parse(body)
                        var data = {
                            user_name: steam.response.players[0].personaname,
                            avatar: steam.response.players[0].avatarmedium,
                            steam_id: steam.response.players[0].steamid
                        }
                        var userObject = new UserModel(data)
                        userObject.save(function(error, user){
                            res.status(200).json(user)
                        })
                    } else {
                        res.sendStatus(response.statusCode)
                    }
                });
            }
        });
    })

    // login a user
    router.post(userUrl + 'login', function (req, res) {
        UserModel.findOne({email: req.body.email}, function(error, user){
            if (user) {
                bcrypt.compare(req.body.password, user.password).then(function (success) {
                    if(success){
                        delete user.password
                        res.status(200).json(user)
                    } else{
                        res.status(421).json("wrong password")
                    }
                });
            } else {
                res.status(420).json({ message: "Email not found" })
            }
        })
    });



    // register a user
    router.post(userUrl + 'register', function (req, res) {
        let userData = req.body;
        UserModel.findOne({email: req.body.email}, function(error, user){
            if(user){
                res.status(420).json({ message: "Email already exist" })
            } else{
                bcrypt.hash(req.body.password, saltRounds).then(function (hash) {
                    userData.password = hash
                    let userObject = new UserModel(userData);
                    userObject.save(function (err, user) {
                        delete user.password
                        res.status(200).json(user)
                    });
                });
            }
        })
    });

    // user deposits
    router.post(userUrl + 'deposit', function (req, res) {
        UserModel.findOne({ email: req.body.user.email }, function (error, user) {
            console.log(user)
            var url = "https://api.gamerpay.com/merchants/v1/payments/"
            var depositData = req.body.deposit
            depositData.transactionId = generateId()
            if (user) {
                request({ method: 'POST', uri: url, json: depositData }, function (error, response, body) {
                    if(response.statusCode == 200){
                        var data = JSON.parse(body)
                        console.log(data)
                        res.status(200).json(data)
                    } else{
                        res.status(response.statusCode).json(response)
                    }
                });
            } else {
                res.status(420).json({ message: "Email not found" })
            }
        })
    });

    // Update a user
    router.put(`${userUrl}:id`, function (req, res) {
        UserModel.findById(req.params.id, function (err, userObject) {
            if (err) {
                res.json({ info: 'error during find case', error: err });
            };
            if (userObject) {
                _.merge(userObject, req.body);
                userObject.save(function (err) {
                    if (err) {
                        res.json({ info: 'error during case update', error: err });
                    };
                    res.status(200).json(userObject)
                });
            } else {
                res.json({ info: 'case not found' });
            }
        });
    });
};

