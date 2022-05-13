const { default: mongoose } = require("mongoose");
const Item = require("../models/item");
const fs = require("fs");
const Decon= require("../../uploads/deleteController");



exports.itemsGetItems = (req, res, next) => {
    Item.find()
        .select("_id title description imageUrl dateOfLoose found user")
        .populate("user", "_id email")
        .exec()
        .then(docs => {
            const items = docs.map((doc) => {

                return {
                    _id: doc._id,
                    title: doc.title,
                    description: doc.description,
                    imageUrl: doc.imageUrl,
                    dateOfLoose: doc.dateOfLoose.toISOString(),
                    found: doc.found,
                    user: doc.user,
                    request: {
                        type: "GET",
                        url: `${process.env.DOMAIN}/items/${doc._id}`
                    }

                }
            });
            res.status(200).json({
                count: docs.length,
                items: items
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}


exports.itemsGetOneItem = (req, res, next) => {
    console.log("here");
    Item.findById(req.params.itemId)
        .select("_id title description imageUrl dateOfLoose found user")
        .populate("user", "_id email")
        .exec()
        .then(doc => {
            if (!doc) {
                return res.status(404).json({
                    message: "Item not found"
                });
            }
            res.status(200).json(doc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
}


exports.itemsCreateItem = (req, res, next) => {
    console.log(req.file.path);
    const item = new Item({
        _id: mongoose.Types.ObjectId(),
        title: req.body.title,
        description: req.body.description,
        imageUrl: `${process.env.DOMAIN}/${req.file.path}`.replace(/\\/g, "/"),
        found: req.body.found,
        user: req.userData._id
    });

    item.save()
        .then(result => {
            res.status(201).json({
                message: "item was added",
                item: item,
                request: {
                    type: "GET",
                    url: `${process.env.DOMAIN}/${item._id}`
                }
            });
        })
        .catch(err => {
            console.log(err);
            json.status(500).json({
                error: err
            });
        });
}


exports.itemsUpdateItem = (req, res, next) => {
    Item.updateOne({ _id: req.params.itemId }, { $set: req.body })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: "updated successfully"
            })
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });

}


exports.itemsDeleteItem = (req, res, next) => {
    var imagePath;
    Item.findById(req.params.itemId).exec().then(doc => {
        imagePath = doc.imageUrl.split(`${process.env.DOMAIN}/uploads/`)[1];
        console.log(imagePath);
        Item.deleteOne({ _id: req.params.itemId })
            .exec()
            .then(result => {
                Decon(imagePath);
                res.status(200).json({
                    message: "deleted successfully"
                });
            })

    }).catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    })

}