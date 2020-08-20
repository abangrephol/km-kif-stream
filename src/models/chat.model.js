const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatUser'
    },
    message: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Chat = mongoose.model('Chat', ChatSchema);

module.exports = Chat;