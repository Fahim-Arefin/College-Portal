const express = require("express");
const router = express.Router();
const teacherNoticeController = require('../controllers/teachersNotice')

const {isLoggedIn,isTeacher,isNoticeAuthor} = require('../middleware')

//index
router.get('/',isLoggedIn,teacherNoticeController.index)

//new
router.get('/new',isLoggedIn,isTeacher,teacherNoticeController.renderNewNoticeForm)

//create
router.post('/',isLoggedIn,isTeacher,teacherNoticeController.createNotice)

//edit form
router.get('/:id/edit',isLoggedIn,isTeacher,isNoticeAuthor,teacherNoticeController.renderNoticeEditForm)

//edit
router.patch('/:id',isLoggedIn,isTeacher,isNoticeAuthor,teacherNoticeController.updateNotice)

//delete
router.delete('/:id',isLoggedIn,isTeacher,isNoticeAuthor,teacherNoticeController.deleteNotice)

module.exports = router