const express = require("express");
const req = require("express/lib/request");
const { json } = require("express/lib/response");
const mongoose = require("mongoose");
const item = require("../models/item");
const router = express.Router();
const Item = require('../models/item');
const Message = require('../models/message');
const User = require('../models/user');



router.get("/recivedMessages/:reciverId", (req, res, next) => {
    Message.find({ reciver: req.params.reciverId })
        .select("_id sender item messageText")
        .populate("item")
        .populate("sender", '_id email phoneNumber')
        
        .exec()
        .then(docs => {
            if (!docs) {
                res.status(200).json({ message: "no messages" });
            }
            const messages = docs.map((doc) => {
                return {
                    id: doc._id,
                    messageText: doc.messageText,
                    sender: doc.sender,
                    item: doc.item

                }

            });
            res.status(200).json({ count: messages.length, messages: messages });
        }).catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        })
});
router.post("/sendMessage/:reciverId", async (req, res, next) => {
    const sender = await User.findById(req.userData._id);
    const reciver = await User.findById(req.params.reciverId);
    console.log("from messages controller 38");
    console.log(sender);
    const message = new Message({
        _id: mongoose.Types.ObjectId(),
        sender: sender,
        reciver: reciver,
        messageText: req.body.messageText,
        item: req.body.itemId
    });
    message.save().then(result => {
        res.status(201).json({
            message: "sent successfully"
        });
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    })
});
router.delete("/:mesageId", (req, res, next) => {
    Message.deleteOne({ _id: req.params.mesageId }).exec().then(result => {
        res.status(200).json({ message: "deleted successfully" }).catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        })
    })
})
module.exports = router;
