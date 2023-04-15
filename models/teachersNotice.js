const mongoose  = require('mongoose')

const teacherNoticeSchema = new mongoose.Schema({
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
    section:{
        type:String,
        required:true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('TeacherNotice',teacherNoticeSchema)