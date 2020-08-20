const mongoose = require('mongoose');

const ChatUserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    allowPrize: {
        type: Boolean,
        default: true
    }
});

const ChatUser = mongoose.model('ChatUser', ChatUserSchema);

module.exports = ChatUser;