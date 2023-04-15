const UniversityNotice = require('../models/universityNotice')

module.exports.index = async(req,res)=>{
    const universityNotice = await UniversityNotice.find({})
    res.render('universityNotice/index',{universityNotice})
}