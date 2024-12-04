const mongoose = require('mongoose');

const noteSchema = mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User ', // Reference to the User model
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Note', noteSchema);