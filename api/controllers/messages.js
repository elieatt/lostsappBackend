const Item = require('../models/item');
const Message = require('../models/message');
const User = require('../models/user');
//const Item = require("../models/item");
const mongoose = require("mongoose");

exports.sendMessage = async (req, res, next) => {
    const senderId = await User.findById(req.userData._id);
    const reciverId = await User.findById(req.params.reciverId);
    const itemId = await Item.findById(req.body.itemId);
    const exsitsMessage = await Message.findOne({ item: itemId, sender: senderId, reciver: reciverId });
    if (exsitsMessage) {
        res.status(400).json({ message: "message can't be sent twice for the same item" });
        return;
    }

    const message = new Message({
        _id: mongoose.Types.ObjectId(),
        sender: senderId,
        reciver: reciverId,
        messageText: req.body.messageText,
        item: req.body.itemId
    });
    message.save().then(result => {
        res.status(201).json({
            message: "sent successfully"
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    })
};

exports.reciveMessage = (req, res, next) => {
    Message.find({ reciver: req.params.reciverId })
        .select("_id sender reciver item messageText")
        .populate("item")
        .populate("reciver", '_id email phoneNumber userName')
        .populate("sender", '_id email phoneNumber userName')
        .exec()
        .then(docs => {
            if (!docs) {
                res.status(200).json({ message: "no messages" });
            }
            const messages = docs.reverse().map((doc) => {
                let iitem = doc.item;
                iitem.user=doc.reciver
                return {
                    id: doc._id,
                    messageText: doc.messageText,
                    sender: doc.sender,
                    reciver: doc.reciver,
                    item: iitem

                }

            });
            res.status(200).json({ count: messages.length, messages: messages });
        }).catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        })
};

exports.getSentMessages = (req, res, next) => {


    Message.find({ sender: req.params.senderId })
        .select("_id reciver sender item messageText")
        .populate("item")
        .populate("reciver", '_id email phoneNumber userName')
        .populate("sender", '_id email phoneNumber userName')
        .exec()
        .then(docs => {

            if (!docs) {
                res.status(200).json({ message: "no messages" });
            }
            const messages = docs.reverse().map((doc) => {
                let iitem = doc.item;
                iitem.user=doc.reciver
                return {
                    id: doc._id,
                    messageText: doc.messageText,
                    sender: doc.sender,
                    item: iitem,
                    reciver: doc.reciver

                }

            });

            res.status(200).json({ count: messages.length, messages: messages });
        }).catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        })
};
exports.deleteMessage = (req, res, next) => {
    Message.deleteOne({ _id: req.params.mesageId }).exec().then(result => {
        res.status(200).json({ message: "deleted successfully" }).catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        })
    })
};