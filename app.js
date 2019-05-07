const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cron = require("node-cron");
const mongoose = require('mongoose');
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
mongoose.connect('mongodb://localhost:27017/jujucase', { useNewUrlParser: true });
const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected to MongoDB');
});

updateItems()
cron.schedule("15 13 * * *", function () {
    updateItems()
});


require('./models/User');
require('./models/Transaction');
require('./models/Case');
require('./models/CaseItem');
require('./models/Item');
require('./models/Trades');
require('./models/TradeHistory');
require('./config/passport');
app.use(require('./routes'));

app.listen(8081, () => console.log('Server running on http://localhost:8081/'));

function updateItems(){
    const Items = require('./models/Item');
    const Users = require('./models/User');
    Items.deleteMany().exec()
    const request = require('request');
    var url = 'http://api.basilisk.gg/items/v1/730/directory';
    request({ method: 'GET', uri: url }, function (error, response, body) {
        if (response.statusCode == 200) {
            var inventory = JSON.parse(body)
            inventory.forEach(item => {
                var newInventoryItem = new Items(item)
                newInventoryItem.save()
            });
        }
    });
}