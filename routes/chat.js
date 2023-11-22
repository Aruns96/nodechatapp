const express = require("express");
const chatControllers = require("../controllers/chat");
const authorization = require("../middlewares/auth")
const fileupload=require('express-fileupload')
const router = express.Router();

router.get("/get-users",authorization.authorize,chatControllers.getUsers);


router.post("/post-message",authorization.authorize,chatControllers.postSend);
router.post("/post-image",authorization.authorize,fileupload(),chatControllers.postSendImg);

router.get("/get-messages",chatControllers.getMsg);


module.exports = router;