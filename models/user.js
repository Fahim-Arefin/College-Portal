const mongoose  = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required: true,
    },
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    section:{
        type:String,
    },
    year:{
        type:String,
    },
    phoneNumber:{
        type:String,
        required:true
    },
    room:{
        type:String,
    },
    tag:{
        type:String,
        required:true,
        enum:['student','faculty','guardian']
    },
    classTeacher:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    },
    guardian:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    }
    
    //(username,salt,hash) 3 fields are here bcz of plugin
    // hash field is the password field
})

userSchema.plugin(passportLocalMongoose)    
module.exports = mongoose.model('User',userSchema)