const mongoose  = require('mongoose')

const contentSchema = new mongoose.Schema({
        link:{
            type:String,
            required:true
        },
        linkName:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        subjectID:{
            type:String,
            required:true
        },
        sectionID:{
            type:String,
            required:true
        }

})

const fileUploadSchema = new mongoose.Schema({
    filename: {
      type: String,
      required: true
    },
    slideName: {
      type: String,
      required: true
    },
    contentType: {
      type: String,
      required: true
    },
    path: {
      type: String,
      required: true
    },
    subjectID:{
        type:String,
        required:true
    },
    sectionID:{
        type:String,
        required:true
    }
});
  

const materialSchema = new mongoose.Schema({
    courseMaterials:{
        type:[contentSchema]
    },
    courseMarks:{
        type:[contentSchema]
    },
    slides:{
        type:[fileUploadSchema]
    }
})

module.exports = mongoose.model('Material',materialSchema)