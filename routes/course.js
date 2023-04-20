const express = require("express");
const router = express.Router();
const {isLoggedIn} = require('../middleware')

const courseController = require('../controllers/course')

//multer
const multer  = require('multer')


//config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/slides')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
  })

//only allow .ppt file
const fileFilter = function (req, file, cb) {
  if (file.mimetype === 'application/vnd.ms-powerpoint' || file.mimetype === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
    // Accept the file
    cb(null, true);
  } else {
    // Reject the file
    cb(new Error('Only .ppt files are allowed'));
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.get('/',isLoggedIn,courseController.index)

router.get('/:subjectID/:sectionID',isLoggedIn,courseController.show)

router.post('/:subjectID/:sectionID',isLoggedIn,upload.single('slide'),courseController.createMaterial)

router.get('/slide/download/:slideID',isLoggedIn,courseController.slideDownload)

module.exports = router