const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
        trim: true
    },

    productName: {
        type: String,
        required: true,
        trim: true
    },
    issueType: {
        type: String,
        required: true,
        trim: true
    },
    issueDescription: {
        type: String,
        required: true,
        trim: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Issue', IssueSchema);