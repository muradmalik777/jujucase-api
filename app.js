const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
mongoose.connect('mongodb://localhost:27017/jujucase');
const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected to MongoDB');
});

require('./models/User');
require('./models/Transaction');
require('./models/Case');
require('./models/Trades');
require('./models/TradeHistory');
require('./config/passport');
app.use(require('./routes'));

app.listen(3000, () => console.log('Server running on http://localhost:3000/'));