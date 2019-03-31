const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
mongoose.connect('mongodb://localhost/jujucase', { useNewUrlParser: true });
mongoose.set('debug', true);

require('./models/User');
require('./config/passport');
app.use(require('./routes'));

app.listen(3000, () => console.log('Server running on http://localhost:3000/'));