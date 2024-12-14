const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    mobileNumber: {
        type: String,
        required: true,
        unique: true
    },
    aadharNumber: {
        type: String,
        required: true,
        unique: true
    },
    pin: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['farmer', 'distributor', 'consumer', 'serviceProvider'],
        required: true
    },
    isAadhaarVerified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);