const Routine = require('../models/routine')
const Material = require('../models/material')
const User = require('../models/user')
const path = require("path");

module.exports.index = async (req,res,next)=>{
    try{
        const allRoutine = await Routine.find({})
        const student = await User.find({tag:'student'}).populate('guardian')
        res.render('course/index',{allRoutine,student})
    }catch(e){
        next(e)
    }
}
module.exports.show = async (req,res,next)=>{
    try{
        const{subjectID,sectionID} = req.params
        // console.log('sub ID: '+subjectID)
        // console.log('sec ID: '+sectionID)
        // const selectedRoutine = await Routine.findOne(
        //                             {
        //                                 "subject._id": subjectID,
        //                                 "subject.sec._id": sectionID
        //                             },
        //                             {
        //                                 "subject.$": 1, // This will return only the matching sub-document of subject array
        //                             }
        //                         )
        const allRoutine = await Routine.find({})
        const allMaterial = await Material.find({})
        // console.log(allMaterial)
        res.render('course/show',{allRoutine,allMaterial,subjectID,sectionID})
    }catch(e){
        next(e)
    }
}


module.exports.createMaterial = async (req,res,next)=>{
    try{
        const{subjectID,sectionID} = req.params
        const{data} = req.query
        // console.log('sub ID: '+subjectID)
        // console.log('sec ID: '+sectionID)
        

        //saving data into courseMaterials 
        if(data==='courseMaterials'){
            const { link, description, linkName } = req.body;
            let newMaterial = { link, description , linkName};
            newMaterial.subjectID = subjectID
            newMaterial.sectionID = sectionID
    
            const material = await Material.findOne();
            if (material) {
                // If a Material document already exists, update it with the new course material
                material.courseMaterials.push(newMaterial);
                await material.save();
            } else {
                // If no Material document exists, create a new one with the course material
                const newMaterialDocument = await Material.create({ courseMaterials: [newMaterial] });
            }

            req.flash("success", "Your Course Material has been added");
            res.redirect(`/courses/${subjectID}/${sectionID}`);
        }

        if(data==='courseMarks'){
            const { link, description, linkName } = req.body;
            let newMaterial = { link, description , linkName};
            newMaterial.subjectID = subjectID
            newMaterial.sectionID = sectionID
    
            const material = await Material.findOne();
            if (material) {
                // If a Material document already exists, update it with the new course material
                material.courseMarks.push(newMaterial);
                await material.save();
            } else {
                // If no Material document exists, create a new one with the course material
                const newMaterialDocument = await Material.create({ courseMarks: [newMaterial] });
            }

            req.flash("success", "Your Course Marks has been added");
            res.redirect(`/courses/${subjectID}/${sectionID}`);
        }

        if(data==='slide'){
            // console.log(req.file)
            const file = {
                filename: req.file.filename,
                contentType: req.file.mimetype,
                path: req.file.path,
                subjectID:subjectID,
                sectionID:sectionID
            }
            file.slideName = req.body.slideName

            // console.log(file)
            const material = await Material.findOne();
            if (material) {
                // If a Material document already exists, update it with the new course material
                material.slides.push(file);
                await material.save();
            } else {
                // If no Material document exists, create a new one with the course material
                const newMaterialDocument = await Material.create({ slides: [file] });
            }


            req.flash("success", "Your Slides has been uploaded");
            res.redirect(`/courses/${subjectID}/${sectionID}`);
        }
    }catch(e){
        next(e)
    }
}

module.exports.slideDownload = async(req,res,next)=>{
    try{
        const {slideID} = req.params

        // Find the slides in the database
        const material = await Material.findOne({ "slides._id": slideID });

        if (!material) {
        return res.status(404).send('Slides not found');
        }

        const slide = material.slides.find(slide => slide._id.toString() === slideID);

        if (!slide) {
        return res.status(404).send('Slide not found');
        }
        console.log(slide)

        // Set the response headers
        res.set({
            'Content-Type': slide.contentType,
            'Content-Disposition': `attachment; filename=${slide.filename}`
        });

        // Send the slides data
        // res.download(path.join(__dirname, '..', 'public', 'slides', slide.filename), slide.filename);
        res.download(path.join(__dirname, '..', 'public', 'slides', slide.filename), slide.filename);


    }catch(e){
        next(e)
    }
}