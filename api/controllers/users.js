const mongoose = require("mongoose");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");



exports.usersSignup = (req, res, next) => {
    User.findOne({ email: req.body.email }).exec()
        .then(doc => {
            console.log(doc);
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
                        phoneNumber:req.body.phoneNumber
                    });
                    user.save()
                        .then(result => {
                            res.status(201).json({
                                message: "User was created"
                                , user: {
                                    email: user.email,
                                    _id: user._id
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
                            phoneNumber:user.phoneNumber
                        }, process.env.JWTPRIVATE, { expiresIn: "2d" }, (err, token) => {
                            if (err) {
                                console.log(err);
                                res.status(401).json({ message: "auth failed" });
                            }
                            else {
                                res.status(200).json({
                                    message: "auth succeded",
                                    
                                    user:{
                                        id:user._id,
                                        email:user.email,
                                        phoneNumber:user.phoneNumber,
                                        token:token
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