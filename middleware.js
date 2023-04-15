const ExpressError = require('./utils/ExpressError')        //custom error class
const TeacherNotice = require('./models/teachersNotice')

//this middleware is used for check if any user logged in or not
//use this middleware we protect route to access without log in
module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){         //passport provide isAuthenticated() this fuct
        req.flash('error','You must logged in')
        res.redirect('/login')
    }else{
        next()
    }
}

module.exports.isTeacher = (req,res,next)=>{
    if(req.user.tag==='faculty'){
        next()
    }else{
        throw new ExpressError('Your Do not have Permission in this Route',404)
    }
}

module.exports.isStudent = (req,res,next)=>{
    if(req.user.tag==='student'){
        next()
    }else{
        throw new ExpressError('Your Do not have Permission in this Route',404)
    }
}

//User Authorization middleware
module.exports.isNoticeAuthor = async (req,res,next)=>{
    try {
        const {id} = req.params
        const teacherNotice = await TeacherNotice.findById(id)
        let fullname = req.user.firstname+' '+req.user.lastname
        if(teacherNotice.noticeHolder===fullname){
            next()
        }else{
            req.flash('error','You do not have permission to do that')
            res.redirect(`/teacherNotices`)
        }
    } catch (e) {
        next(e)
    }
    
}
