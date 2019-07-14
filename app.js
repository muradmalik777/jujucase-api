const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cron = require("node-cron");
const mongoose = require('mongoose');
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let db;

switch(process.env.NODE_ENV) {
    case 'production': {
        mongoose.connect('mongodb://mongodb.default.svc.cluster.local:27017/jujucase', { useNewUrlParser: true });
        db = mongoose.connection;
        break;
    }

    case 'development': {
        mongoose.connect('mongodb://localhost:27017/jujucase', { useNewUrlParser: true });
        db = mongoose.connection;
    }
}

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected to MongoDB');
});

// updateItems()
cron.schedule("15 13 * * *", function () {
    updateItems()
});

require('./config/passport');

app.use(function(req, res, next) {
    var allowedOrigins = ['https://jujucase.com', 'https://www.jujucase.com', 'https://test.jujucase.com'];
    var origin = req.headers.origin;
    if(allowedOrigins.indexOf(origin) > -1){
         res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    return next();
  });

app.use(require('./routes'));

app.listen(8081, () => console.log('Server running on http://localhost:8081/'));

function updateItems(){
    const Items = require('./models/Item');
    const request = require('request');
    var url = 'http://api.basilisk.gg/items/v1/730/directory';
    request({ method: 'GET', uri: url }, function (error, response, body) {
        if (response.statusCode == 200) {
            var inventory = JSON.parse(body)
            inventory.forEach(item => {
                var newInventoryItem = new Items(item)
                Items.findOne({ 'marketHashName': item.marketHashName }, function(error, doc){
                    if(!doc){
                        console.log("new item added from the remote directory")
                        newInventoryItem.save()
                    }
                });
            });
        }
    });
}