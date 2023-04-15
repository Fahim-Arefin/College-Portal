
const Routine = require('../models/routine')

module.exports.index = async(req,res,next)=>{
    try{
        const allRoutine = await Routine.find({})
        console.log(allRoutine)  //important print to understand 
        res.render('routine/index',{allRoutine})
    }catch(e){
        next(e)
    }
}