const express = require("express");
const req = require("express/lib/request");
const router = express.Router();
const UsersControllers = require("../controllers/users");
const auth_check = require("../middlewares/auth_check");


router.post("/signup", UsersControllers.usersSignup);

router.post("/login", UsersControllers.usersLogin);


router.put("/",auth_check,UsersControllers.UserUpdateUser);

router.delete("/", auth_check, UsersControllers.userDeleteUser);

module.exports = router;