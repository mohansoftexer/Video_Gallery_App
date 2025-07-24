var mongoose = require('mongoose');
var schema = mongoose.Schema;
var videodata = new schema({
    videoUniqueID: {
        type: String,
        required: true,
        default: ""
    },
    emailID: {
        type: String,
        required: false,
        default: ""
    },
    title: {
        type: String,
        required: false,
        default: ""
    },
    description: {
        type: String,
        required: false,
        default: ""
    },
    videopath: {
        type: String,
        required: false,
        default: ""
    },
    filename: {
        type: String,
        required: false,
        default: ""
    },
    videoViewCount: {
        type: Number,
        required: false,
        default: 0
    },

    timeStamp: {
        type: String,
        required: false,
        default: new Date().getTime().toString()
    }
})

module.exports = mongoose.model('uploadvideo', videodata)
