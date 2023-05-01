const TeacherNotice = require('../models/teachersNotice')
const Routine = require('../models/routine')
const User = require('../models/user')
require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

//require util 
const {buildMail,sendMail} = require('../utils/sendMail');
const ExpressError = require('../utils/ExpressError');

module.exports.index = async(req,res,next)=>{
    try{
        const teacherNotice = await TeacherNotice.find({}).sort('-created_at')
        const users = await User.find({tag:'student'}).populate('guardian')
        res.render('notice/index',{teacherNotice,users})
    }catch(e){
        next(e)
    }
    
}

module.exports.renderNewNoticeForm = async(req,res,next)=>{
    try {
        const allRoutine = await Routine.find({})
        res.render('notice/new',{allRoutine})
    }catch(e) {
        next(e)
    }
}

module.exports.createNotice= async(req,res,next)=>{
    try {
        const noticeHolder = req.user.firstname + " " + req.user.lastname;
        req.body.notice.noticeHolder = noticeHolder 
        selectedSubject = req.body.notice.subject
        selectedSection = req.body.notice.section
        const allRoutine = await Routine.find({})

        let missmatchFlag = true
        for (const routine of allRoutine) { 
            for (const subject of routine.subject) { 
              for (const section of subject.sec) { 
                if (subject.name === selectedSubject && section.teacher === noticeHolder && section.name === selectedSection) {
                  missmatchFlag = false;
                  break; // exit the innermost loop
                }
              }
              if (!missmatchFlag) {
                break; // exit the middle loop
              }
            }
            if (!missmatchFlag) {
              break; // exit the outermost loop
            }
        }

        if(!missmatchFlag){
            const teacherNotice = new TeacherNotice(req.body.notice);
            const newlyCreatedNotice = await teacherNotice.save();
            if(newlyCreatedNotice.important===true){

                let to = 'fahimarefin57@gmail.com'
                let from = 'maf181238@gmail.com'
                let subject = 'Do not reply this automated mail'
                let html = `<b>Hello Student's of section ${newlyCreatedNotice.section}</b><br>
                            Your course ${newlyCreatedNotice.subject} teacher ${newlyCreatedNotice.noticeHolder} just uploaded a very important announcement<br>
                            please check your portal immediately`
            
                const msg = buildMail(to,from,subject,html)
                const isMailSendToStudent = await sendMail(msg)
                console.log(isMailSendToStudent)

                if(isMailSendToStudent){
                        req.flash("success", "Notice has been posted also email send!!");
                        res.redirect("/teacherNotices");
                }else{
                    throw new ExpressError('Student Mail did not send',424)
                }
            }else{
                req.flash("success", "Notice has been posted!!");
                res.redirect("/teacherNotices");
            }
        }else{
            throw new ExpressError('Your Subject and Section Miss Matched')
        }
        
        
    } catch (e) {
        next(e)
    }
}

module.exports.renderNoticeEditForm= async(req,res,next)=>{
    try {
        const {id} = req.params
        const notice = await TeacherNotice.findById(id)
        if(!notice){
            req.flash('error','Couldnot find that notice from teacher')
            res.redirect('/teacherNotices')
        }else{
        res.render('notice/edit', {notice})
        }
    }catch(e){
        next(e)
    }
}

module.exports.updateNotice= async(req,res,next)=>{
    try {
        const { id } = req.params
        req.body.notice.noticeHolder = req.user.firstname + " " + req.user.lastname;
        const updatedNotice = await TeacherNotice.findByIdAndUpdate(id,{ ...req.body.notice },{ runValidators: true, new: true })
        if(updatedNotice.important===true){

            let to = 'fahimarefin57@gmail.com'
            let from = 'maf181238@gmail.com'
            let subject = 'Do not reply this mail'
            let html = `<b>Hello Student's of section ${updatedNotice.section}</b><br>
                        Your course teacher ${updatedNotice.noticeHolder} just uploaded a very important announcement<br>
                        please check your portal immediately`
        
            const msg = buildMail(to,from,subject,html)
            const isMailSend = await sendMail(msg)
            console.log(isMailSend)

            if(isMailSend){
                req.flash("success", "Notice has been updated also email send!!");
                res.redirect("/teacherNotices");
            }else{
                throw new ExpressError('Mail did not send',424)
            }
        }else{
            req.flash("success", "Notice has been updated!!");
            res.redirect("/teacherNotices");
        }
    }catch(e){
        next(e)
    }
}

module.exports.deleteNotice= async(req,res,next)=>{
   try{
        const { id } = req.params
        await TeacherNotice.findByIdAndDelete(id)
        req.flash('success','Successfully Deleted A Notice')        //message key is 'success'
        res.redirect(`/teacherNotices`)   //get req by default
   }catch(e){
        next(e)
   }
}