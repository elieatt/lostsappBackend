const express = require("express");
const router = express.Router();
const UsersControllers = require("../controllers/users");


router.post("/signup",UsersControllers.usersSignup);

router.post("/login",UsersControllers.usersLogin);

module.exports = router;