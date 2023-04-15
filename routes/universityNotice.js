const express = require("express");
const router = express.Router();
const universityNoticeController = require('../controllers/universityNotice')

const {isLoggedIn} = require('../middleware')

//index
router.get('/',isLoggedIn,universityNoticeController.index)


module.exports = router