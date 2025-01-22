const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    deleted: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true,
});
const usermodel = mongoose.model('users', schema);
module.exports = usermodel;