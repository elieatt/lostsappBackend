const express = require("express");


const router = express.Router();
const messagesController = require('../controllers/messages');




router.get("/recivedMessages/:reciverId", messagesController.reciveMessage);

router.post("/sendMessage/:reciverId", messagesController.sendMessage);

router.delete("/:mesageId", messagesController.deleteMessage);

module.exports = router;
