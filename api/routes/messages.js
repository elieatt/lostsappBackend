const express = require("express");


const router = express.Router();
const messagesController = require('../controllers/messages');




router.get("/recivedMessages/:reciverId", messagesController.reciveMessage);

router.get("/getSentMessages/:senderId",messagesController.getSentMessages);

router.post("/sendMessage/:reciverId", messagesController.sendMessage);

router.put("/readAmessage/:messageId",messagesController.readMessage);

router.delete("/:mesageId", messagesController.deleteMessage);

module.exports = router;
