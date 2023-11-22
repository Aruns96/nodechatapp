const express = require("express");
const groupControllers = require("../controllers/group");
const authorization = require("../middlewares/auth")

const router = express.Router();

router.post("/create-group",authorization.authorize,groupControllers.postCreate);

router.post('/update-group',authorization.authorize,groupControllers.edit)

router.get('/get-group-members',groupControllers.getGroupMembersbyId)
router.get('/get-group-messages',groupControllers.getGroupMessages)
router.get('/get-group',groupControllers.getGroupbyId)
router.get('/get-user',authorization.authorize,groupControllers.getCurrentUser)
router.get('/get-mygroups',authorization.authorize,groupControllers.getMygroups)

module.exports = router;