const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    uniqueString: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
    },
    expiresAt: {
        type: Date,
    }
}, {
    timestamps: true,
});
const userverificationmodel = mongoose.model('userverification', schema);
module.exports = userverificationmodel;