const express = require("express");
const router = express.Router();

// Sample route to get all messages

const {
  getMessages,
  CreateMessage,
  deleteAllMessages,
} = require("../controllers/messageControllers");

router.get("/", getMessages);

router.post("/", CreateMessage);
router.delete("/", deleteAllMessages);
module.exports = router;