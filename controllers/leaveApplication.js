const Leave = require("../models/leaveApplication");
require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

//util require
const {buildMail,sendMail} = require('../utils/sendMail');
const ExpressError = require("../utils/ExpressError");

module.exports.index = async (req, res,next) => {
  try {
    const allLeaveApplications = await Leave.find({}).populate({
      path: 'applicant',
      populate: [
        { path: 'classTeacher' },
        { path: 'guardian' }
      ]
    });
    res.render("leaveApplication/index", { allLeaveApplications });
  }catch(e) {
    next(e)
  }
};

module.exports.create = async (req, res,next) => {
  try {
    // req.body.leave.name = req.user.firstname + " " + req.user.lastname;
    // req.body.leave.year = req.user.year;
    // req.body.leave.section = req.user.section;
    // req.body.leave.email = req.user.email;
    // req.body.leave.userId = req.user.username;
    let startDate = Date.parse(req.body.leave.startDate);
    let endDate = Date.parse(req.body.leave.endDate);    

    if (endDate < startDate) {
        // If end date is earlier than start date, return an error response
        throw new ExpressError('End date cannot be earlier than start date.',400)
    }
    
    //time and date diff
    // const startDate = new Date(req.body.start_date);
    // const endDate = new Date(req.body.end_date);
    // const timeDiff = endDate.getTime() - startDate.getTime();
    // const daysDiff = timeDiff / (1000 * 3600 * 24);


    const msPerDay = 1000 * 60 * 60 * 24;
    const daysDiff = Math.floor((endDate - startDate) / msPerDay);
    const days = daysDiff+1

    if(days>7){
      throw new ExpressError('You can not take leave more than 1 week',400)
    }

    req.body.leave.days = (days)
    req.body.leave.applicant = req.user
    const leave = new Leave(req.body.leave);
    // console.log(leave)
    await leave.save();
    req.flash("success", "Your Form has been posted wait for response");
    res.redirect("/leaveApplications/new");

  }catch(e) {
    next(e)
  }
  
};

module.exports.newLeaveForm = (req, res,next) => {
  res.render("leaveApplication/new");
};

module.exports.acceptedApplication = async (req, res,next) => {
  try {
    const { leaveID } = req.params;
    const leaveApplciation = await Leave.findById(leaveID).populate({
      path: 'applicant',
      populate: [
        { path: 'classTeacher' },
        { path: 'guardian' }
      ]
    });
    
    let to = 'mfahim181238@bscse.uiu.ac.bd'
    let from = 'fahimarefin57@gmail.com'
    let subject = 'Do not reply this automated mail'
    let html = `<b>Hello ${leaveApplciation.applicant.firstname+' '+leaveApplciation.applicant.lastname}</b><br>
                You are Requested for ${leaveApplciation.days} days leave.<br>
                Your Class Teacher ${leaveApplciation.applicant.classTeacher.firstname+' '+leaveApplciation.applicant.classTeacher.lastname}
                has been accepted your leave request<br>`

    const msg = buildMail(to,from,subject,html)
    const isMailSendToStudent = await sendMail(msg)
    console.log(isMailSendToStudent)
    if(isMailSendToStudent){
        

        let to = 'maf181238@gmail.com'
        let from = 'fahimarefin57@gmail.com'
        let subject = 'Do not reply this automated mail'
        let html = `<b>Hello ${leaveApplciation.applicant.guardian.firstname+' '+leaveApplciation.applicant.guardian.lastname}</b><br>
                    Your chlid ${leaveApplciation.applicant.firstname+' '+leaveApplciation.applicant.lastname} is Requested for ${leaveApplciation.days} days leave.<br>
                    His Class Teacher ${leaveApplciation.applicant.classTeacher.firstname+' '+leaveApplciation.applicant.classTeacher.lastname}
                    has been accepted your child's leave request from ${leaveApplciation.startDate} to ${leaveApplciation.endDate}<br>`

        const msg = buildMail(to,from,subject,html)
        const isMailSendToGuardian = await sendMail(msg)
        console.log(isMailSendToGuardian)

        if(isMailSendToGuardian){
              const deletedApplication = await Leave.findByIdAndDelete(leaveID);
              // console.log(deletedApplication)
              req.flash("success", "You Just Accepted One Leave Application");
              res.redirect("/leaveApplications");
        }else{
          throw new ExpressError('Guardian Mail did not send',424)
        }
        
    }else{
      throw new ExpressError('Student Mail did not send',424)
    }


    // const msg = {
    //   to: "maf181238@gmail.com",
    //   from: "fahimarefin57@gmail.com", // Use the email address or domain you verified above
    //   subject: "Do not reply this mail",
    //   html: `<b>Hello ${leaveApplciation.name}</b><br>
    //           Your Requested for ${leaveApplciation.days} days leave.<br>
    //           Your request has been accepted<br>`,
    // };

    // sgMail
    //   .send(msg)
    //   .then(async (data) => {
    //     console.log("Email sent");
    //     console.log(data);
    //     const deletedApplication = await Leave.findByIdAndDelete(leaveID);
    //     // console.log(deletedApplication)
    //     req.flash("success", "You Just Accepted One Leave Application");
    //     res.redirect("/leaveApplications");
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
  } catch (e) {
    next(e)
  }
  
};

module.exports.rejectedApplication = async (req, res,next) => {
  try{
    const { leaveID } = req.params;
    const leaveApplciation = await Leave.findById(leaveID).populate({
      path: 'applicant',
      populate: [
        { path: 'classTeacher' },
        { path: 'guardian' }
      ]
    });
    
    let to = 'mfahim181238@bscse.uiu.ac.bd'
    let from = 'fahimarefin57@gmail.com'
    let subject = 'Do not reply this bot generate automated mail'
    let html = `<b>Hello ${leaveApplciation.applicant.firstname+' '+leaveApplciation.applicant.lastname}</b><br>
                You are Requested for ${leaveApplciation.days} days leave.<br>
                Your Class Teacher ${leaveApplciation.applicant.classTeacher.firstname+' '+leaveApplciation.applicant.classTeacher.lastname}
                has been rejected your leave request since invalid reason<br>`

    const msg = buildMail(to,from,subject,html)
    const isMailSendToStudent = await sendMail(msg)
    console.log(isMailSendToStudent)
    if(isMailSendToStudent){
        

        let to = 'maf181238@gmail.com'
        let from = 'fahimarefin57@gmail.com'
        let subject = 'Do not reply this bot generate automated mail'
        let html = `<b>Hello ${leaveApplciation.applicant.guardian.firstname+' '+leaveApplciation.applicant.guardian.lastname}</b><br>
                    Your chlid ${leaveApplciation.applicant.firstname+' '+leaveApplciation.applicant.lastname} is Requested for ${leaveApplciation.days} days leave.<br>
                    His Class Teacher ${leaveApplciation.applicant.classTeacher.firstname+' '+leaveApplciation.applicant.classTeacher.lastname}
                    has been rejected your child's leave request from ${leaveApplciation.startDate} to ${leaveApplciation.endDate}<br>`

        const msg = buildMail(to,from,subject,html)
        const isMailSendToGuardian = await sendMail(msg)
        console.log(isMailSendToGuardian)

        if(isMailSendToGuardian){
              const deletedApplication = await Leave.findByIdAndDelete(leaveID);
              // console.log(deletedApplication)
              req.flash("success", "You Just Rejected One Leave Application");
              res.redirect("/leaveApplications");
        }else{
          throw new ExpressError('Guardian Mail did not send',424)
        }
        
    }else{
      throw new ExpressError('Student Mail did not send',424)
    }
      
  }catch(e){
    next(e)
  }
};
