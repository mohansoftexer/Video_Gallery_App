var mongoose = require('mongoose');
var dbconnect = require('./mongooseConnection')
var schema = mongoose.Schema;
var usersdata = new schema({

    emailID: {
        type: String,
        required: false,
        default: ""
    },
    password: {
        type: String,
        required: false,
        default: ""
    },
  
    timeStamp: {
        type: String,
        required: false,
        default: new Date().getTime().toString()
    }
})
dbconnect.connectDatabase()
module.exports = mongoose.model('user', usersdata)
