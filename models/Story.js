const mongoose = require('mongoose');

const StorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    body: { // this is the first and last name 
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'public',
        enum: ['public', 'private'],
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, // this is the id of the user from the mongoose schema
        ref: 'User', // this is the name of the model that we are referencing
        required: true,
        // adding required so that the app will fail at the story post, rather than later on
    },
    createdAt: { // each time a user creates a new blog, this field will be updated
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Story', StorySchema); // the first parameter is the name of the model that we use to reference elsewhere in the app and the second parameter is the schema that we are using