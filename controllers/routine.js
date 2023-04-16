
const Routine = require('../models/routine')
const User = require('../models/user')

module.exports.index = async(req,res,next)=>{
    try{
        const allRoutine = await Routine.find({})
        const user = await User.find({tag:'student'}).populate('guardian')
        // console.log(user)
        // console.log(allRoutine)  //important print to understand 
        res.render('routine/index',{allRoutine,user})
    }catch(e){
        next(e)
    }
}