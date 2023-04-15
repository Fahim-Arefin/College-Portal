const express = require("express");
const router = express.Router();
const {isLoggedIn} = require('../middleware')

const routineController = require('../controllers/routine') 

router.get('/',isLoggedIn,routineController.index)

module.exports = router;


