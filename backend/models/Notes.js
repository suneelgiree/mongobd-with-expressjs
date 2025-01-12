const mongoose = require('mongoose'); // Import mongoose
const Schema = mongoose.Schema; // Define Schema

// Create a new Schema for notes
const NotesSchema = new Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title : {
        type: String,
        required: true
    },
    description : {
        type: String,
        required: true
    },
    tag : {
        type: String,
        default : "General"
    },
    date : {
        type: Date,
        default: Date.now
    }

  });

    module.exports = Notes = mongoose.model('notes', NotesSchema);