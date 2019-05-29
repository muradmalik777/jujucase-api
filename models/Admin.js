var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var AdminSchema = new Schema({
    name: {
        type: String,
        default: null
    },
    email: {
        type: String,
        default: null
    },
    password: {
        type: String,
        default: null
    }
});

const Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;