const mongoose = require('mongoose');

const noteSchema = mongoose.Schema({
    content: {
        type: String,
        required: [true, 'Content is required'], 
    },
}, {
    timestamps: true, 
});

module.exports = mongoose.model('Note', noteSchema);