const TeacherNotice = require('../models/teachersNotice')
require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

//require util 
const {buildMail,sendMail} = require('../utils/sendMail')

module.exports.index = async(req,res,next)=>{
    try{
        const teacherNotice = await TeacherNotice.find({}).sort('-created_at')
        res.render('notice/index',{teacherNotice})
    }catch(e){
        next(e)
    }
    
}

module.exports.renderNewNoticeForm = async(req,res,next)=>{
    res.render('notice/new')
}

module.exports.createNotice= async(req,res,next)=>{
    try {
        req.body.notice.noticeHolder = req.user.firstname + " " + req.user.lastname;
        // console.log(req.body.notice)
        const teacherNotice = new TeacherNotice(req.body.notice);
        const newlyCreatedNotice = await teacherNotice.save();
        if(newlyCreatedNotice.important===true){

            let to = 'maf181238@gmail.com'
            let from = 'fahimarefin57@gmail.com'
            let subject = 'Do not reply this mail'
            let html = `<b>Hello Student's of section ${newlyCreatedNotice.section}</b><br>
                        Your course teacher ${newlyCreatedNotice.noticeHolder} just uploaded a very important announcement<br>
                        please check your portal immediately`
        
            const msg = buildMail(to,from,subject,html)
            const isMailSend = await sendMail(msg)
            console.log(isMailSend)

            if(isMailSend){
                req.flash("success", "Notice has been posted also email send!!");
                res.redirect("/teacherNotices");
            }else{
                throw new ExpressError('Mail did not send',424)
            }
        }else{
            req.flash("success", "Notice has been posted!!");
            res.redirect("/teacherNotices");
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

            let to = 'maf181238@gmail.com'
            let from = 'fahimarefin57@gmail.com'
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