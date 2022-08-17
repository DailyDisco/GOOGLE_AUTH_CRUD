const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: true
    },
    displayName: { // this is the first and last name 
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    createdAt: { // each time a user creates a new blog, this field will be updated
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);