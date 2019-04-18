'use strict';
const request = require('request');
const mongoose = require('mongoose');
const UserModel = mongoose.model('User');
require('dotenv').config();

exports.loginOrCreateUser = function(req, res){
    var key = process.env.API_KEY
    var steamid = req.body.id
    var url = 'https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key='+key+ '&steamids='+steamid;
    UserModel.findOne({ steam_id: steamid }, function (err, user) {
        if (user) {
            res.send(user)
        } else {
            request({ method: 'GET', uri: url }, function (error, response, body) {
                if (response.statusCode == 200) {
                    var steam = JSON.parse(body)
                    var data = prepareUserData(steam.response.players)
                    if (createUser(data)){
                        res.send(data)
                    }
                } else {
                    res.sendStatus(response.statusCode)
                }
            });
        }
    });
}

function prepareUserData(data){
    return {
        user_name: data[0].personaname,
        avatar: data[0].avatarmedium,
        steam_id: data[0].steamid
    }
}

function createUser(data){
    var new_user = new UserModel(data)
    return new_user.save()
}
