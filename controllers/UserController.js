const request = require('request');
const UserModel = require('../models/User');
require('dotenv').config();
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

    // register a user
    router.post(userUrl + 'login', function (req, res) {
        UserModel.findOne({email: req.body.email, password: req.body.password}).exec()
            .then(user => res.status(200).
                json(user))
            .catch(error => res.status(500)
                .json({
                    message: "Email or Password Incorrect",
                    error: error
                }))
    });

    // register a user
    router.post(userUrl+'register', function (req, res) {
        let newCase = req.body;
        newCase.items = [];
        let userObject = new UserModel(newCase);
        userObject.save(function (err, user) { 
            res.status(200).json(user)        
        });
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

