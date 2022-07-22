const mongoose = require('mongoose');
const messageSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    item: {
        ref: "Item",
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    sender: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    reciver: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    messageText: {
        type: String, required: true
    },
    read: {
        type: Boolean, default: false
    }
});
module.exports = mongoose.model("Message", messageSchema);