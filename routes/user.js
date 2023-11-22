const express = require("express");
const userControllers = require("../controllers/user");


const router = express.Router();

router.post("/sign-up",userControllers.postSignup)
router.post("/login",userControllers.postLogin)

module.exports = router;