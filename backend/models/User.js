const mongoose = require('mongoose'); // Import mongoose
const Schema = mongoose.Schema; // Define Schema

// Create a new Schema for users
const UserSchema = new Schema({
    name : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    password : {
        type: String,
        required: true
    },
    date : {
        type: Date,
        default: Date.now
    }

  });

    module.exports = User = mongoose.model('user', UserSchema);