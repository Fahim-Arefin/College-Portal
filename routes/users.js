const express = require('express')
const router = express.Router()
const passport = require('passport')

//controller
const users = require('../controllers/users')

//auth
const {isLoggedIn} = require('../middleware')

//welcome page
router.get('/',users.welcomePage)

//login Page
router.get('/login',users.loginPage)

//dashboard 
router.get('/dashboard',isLoggedIn,users.dashboard)

//passport.authenticate() with do the work
router.post('/login',passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),users.login)

//logout
router.get('/logout',users.logout)


module.exports = router