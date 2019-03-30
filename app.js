const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const mongoose = require('mongoose');

// mongoose.promise = global.Promise;
const app = express();

app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// mongoose.connect('mongodb://localhost/passport-tutorial');
// mongoose.set('debug', true);

require('./config/passport');
app.use(require('./routes'));

app.listen(8000, () => console.log('Server running on http://localhost:8000/'));