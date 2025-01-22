const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    startedDate: {
        type: Date,
        default: Date.now()
    },
    dueDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Completed', 'Cancelled'],
        default: 'Pending',
    },

}, { timestamps: true });

const taskmodel = mongoose.model('tasks', schema);
module.exports = taskmodel
