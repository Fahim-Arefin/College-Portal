const mongoose  = require('mongoose')

const universityNoticeSchema = new mongoose.Schema({
    noticeHolder:{
        type:String,
        required:true
    },
    noticeText:{
        type:String,
        required:true
    },
    important:{
        type:Boolean,
        default:false
    },
})

module.exports = mongoose.model('UniversityNotice',universityNoticeSchema)