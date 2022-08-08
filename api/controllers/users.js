const mongoose = require("mongoose");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Message = require("../models/message");
const Item = require("../models/item");
const ItemsControllers = require("../controllers/items");



exports.usersSignup = (req, res, next) => {
    User.findOne({ email: req.body.email }).exec()
        .then(doc => {
            //console.log(doc);
            if (doc) {
                return res.status(409).json({ message: "email already exists" });
            }
            bcrypt.hash(req.body.password, bcrypt.genSaltSync(10), (err, hash) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: "error while crypting"
                    });
                }
                else {
                    const user = new User({
                        _id: mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash,
                        phoneNumber: req.body.phoneNumber,
                        userName: req.body.userName,
                    });
                    user.save()
                        .then(result => {
                            res.status(201).json({
                                message: "User was created"
                                , user: {
                                    email: user.email,
                                    _id: user._id,
                                    phoneNumber: user.phoneNumber
                                }
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({ error: err });
                        })
                }
            });


        }).catch(err => {
            console.log(err);
            res.status(500).json({ error: err });

        })

}



exports.usersLogin = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .exec()
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: "Password or Email is incorrect" });
            }
            else {
                bcrypt.compare(req.body.password, user.password, (err, result) => {
                    if (err || !result) {
                        console.log(err);
                        res.status(401).json({ message: "Password or Email is incorrect" });
                    }
                    else {
                        jwt.sign({
                            email: user.email,
                            _id: user._id,
                            phoneNumber: user.phoneNumber
                        }, process.env.JWTPRIVATE, { expiresIn: "2d" }, (err, token) => {
                            if (err) {
                                console.log(err);
                                res.status(401).json({ message: "auth failed" });
                            }
                            else {
                                res.status(200).json({
                                    message: "auth succeded",

                                    user: {
                                        id: user._id,
                                        email: user.email,
                                        phoneNumber: user.phoneNumber,
                                        userName: user.userName,
                                        token: token
                                    }
                                });
                            }
                        });
                    }
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });

}




exports.UserUpdateUser = async (req, res, next) => {
    console.log(req.body.userName);
    if (req.body._id || req.body.email) {
        res.status(405).json({ error: "cant change email" });
        return;
    }

    if (req.body.password && req.body.oldPassword) {
        let user = await User.findById(req.userData._id).exec();
        let passwordCheck = await bcrypt.compare(req.body.oldPassword, user.password);
        console.log(passwordCheck);
        if (!passwordCheck) {

            res.status(401).json({ message: "Old  password  is incorrect" });
            return;
        }
        req.body.password = await bcrypt.hash(req.body.password, bcrypt.genSaltSync(10));


    }

    User.findByIdAndUpdate(req.userData._id, { $set: req.body })
        .exec()
        .then(result => {
            res.status(201).json({
                message: "updated succssefully"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
}   

exports.userDeleteUser = async (req, res, next) => {
    let userItemsImages;
    userItemsImages = await Item.find({user:req.userData._id}).select("imageUrl imagePublicId");
    await Message.deleteMany({$or:[{sender:req.userData._id},{reciver:req.userData._id}]}).exec();
    await Item.deleteMany({ user: req.userData._id }).exec();
    ItemsControllers.deleteImages(userItemsImages);
   

     User.deleteOne({ _id: req.userData._id })
        .exec()
        .then(result => {
            res.status(201).json({
                message: "Deleted successfully"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        }); 
}