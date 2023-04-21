const express = require("express");
const router = express.Router();
const {isLoggedIn,isTeacher} = require('../middleware')

const courseController = require('../controllers/course')

//multer
const multer  = require('multer')


//config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/slides')
    },
    filename: function (req, file, cb) {
        cb(null,file.originalname);
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

const slides = multer({ storage: storage, fileFilter: fileFilter });
const anyFile = multer({ storage: storage });

router.get('/',isLoggedIn,courseController.index)

router.get('/:subjectID/:sectionID',isLoggedIn,courseController.show)

router.post('/:subjectID/:sectionID',isLoggedIn,isTeacher,slides.single('slide'),courseController.createMaterial)

router.put('/:subjectID/:sectionID',isLoggedIn,isTeacher,anyFile.array('file'),courseController.createFile)

router.get('/slide/download/:slideID',isLoggedIn,courseController.slideDownload)

router.delete('/:subjectID/:sectionID/:deleteObjID',isLoggedIn,isTeacher,courseController.delete)

router.patch('/:subjectID/:sectionID/:updateObjID',isLoggedIn,isTeacher,courseController.update)

module.exports = router