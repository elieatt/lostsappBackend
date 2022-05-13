const mongoose = require("mongoose");

const itemSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: String,
    dateOfLoose: { type: Date, default: new Date() },
    found:{type:Number,required:true},
    user: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

module.exports = mongoose.model("Item", itemSchema);