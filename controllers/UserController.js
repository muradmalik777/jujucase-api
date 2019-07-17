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
                            steamId: steam.response.players[0].steamid
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

    // get clientHash
    router.get('/hash', function (req, res) {
        res.status(200).json(generateId())
    });

    router.get(`${userUrl}count/`, function (req, res) {
        UserModel.countDocuments().exec().then(count => {
            res.status(200).json(count)
        })
    });

    // login a user
    router.post(userUrl + 'login', function (req, res) {
        UserModel.findOne({email: req.body.email}, function(error, user){
            if (user) {
                bcrypt.compare(req.body.password, user.password).then(function (success) {
                    if(success){
                        user.password = undefined
                        res.status(200).json(user)
                    } else{
                        res.status(421).json({ message: "Wrong Password" })
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
                        user.password = undefined
                        res.status(200).json(user)
                    });
                });
            }
        })
    });

    // verify a user
    router.post(`${userUrl}verify`, function (req, res) {
        UserModel.findById(req.body.user._id).exec().then(user => {
            var url = "https://shuftipro.com/api/";
            var head = {
                'Authorization': 'Basic NEZaUG9yaXh2RzlLSGJkcVdVQnJrR0FoM3VmMUZMWjBybnhnNUdKWmViSExnSVhQZmwxNTYwNTg5MjQ3OiQyeSQxMCRuYzk0a29zb3RrVG9RV21yNVFpd0pPVFZMNUxkQ08wR2FtQi9yU3ovSWZybGhhc3dqTU1EcQ==',
                'Secret': '$2y$10$nc94kosotkToQWmr5QiwJOTVL5LdCO0GamB/rSz/IfrlhaswjMMDq'
            }
            var data = prepareData(req.body)
            request({ method: 'POST', uri: url, json: data, headers: head }, function (error, response, body) {
                if (response.statusCode == 200) {
                    // var resp = JSON.parse(body)
                    user.reference = body.reference
                    user.has_applied_verification = true
                    user.save(function(err, user){
                        res.status(200).json({
                            user: user,
                            success: true
                        })
                    })
                } else {
                    res.sendStatus(response.statusCode).json(response.statusMessage)
                }
            });
        })
    });

    router.get(`${userUrl}verify/result`, function (req, res) {
        console.log("KYC api hit ------ " + req)
    });

    // user deposits
    router.post(userUrl + 'deposit', function (req, res) {
        UserModel.findOne({ email: req.body.user.email }, function (error, user) {
            var url = "https://api.gamerpay.com/merchants/v1/payments?access_token=f898c80e-2e90-4c08-9011-e9b9e22a2e1e"
            var depositData = req.body.deposit
            depositData.transactionId = generateId()
            if (user) {
                request({ method: 'POST', uri: url, json: depositData }, function (error, response, body) {
                    if(response.statusCode == 200){
                        res.status(200).json(body)
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

    // Get all users - Admin
    // TODO: Add Admin Authorization

    router.get(userUrl, function (req, res) {
        var totalCount = 0
        UserModel.countDocuments().exec().then(count => {
            totalCount = count
            UserModel.find().populate('items').exec()
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
};

function prepareData(body){
    var data = {}
    data.reference = generateId()
    data.verification_mode = "any"
    data.callback_url = "http://127.0.0.1:8081/user/verifiy/result"
    data.document = body
    return data
}