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


module.exports.createFile = async(req,res,next)=>{
    try{
        const{subjectID,sectionID} = req.params
        const files = req.files;

        const material = await Material.findOne();
        if (material) {
            // If a Material document already exists, update it with the new course material
            for (const file of files) {
                material.files.push({
                    filename: file.filename,
                    contentType: file.mimetype,
                    path: file.path,
                    subjectID: subjectID,
                    sectionID: sectionID
                });
            }
            await material.save();
        } else {
            // If no Material document exists, create a new one with the course material
            const newMaterialDocument = await Material.create({ 
            files: files.map(file => ({
                    filename: file.filename,
                    contentType: file.mimetype,
                    path: file.path,
                    subjectID: subjectID,
                    sectionID: sectionID
                    }))
            });
        }
        req.flash("success", "Your files has been uploaded");
        res.redirect(`/courses/${subjectID}/${sectionID}`);

    }catch(e){
        next(e)
    }
}


module.exports.slideDownload = async(req,res,next)=>{
    try{
        const {slideID} = req.params
        const {data} = req.query

        if(data==='file'){
            // Find the slides in the database
            const material = await Material.findOne({ "files._id": slideID });

            if (!material) {
            return res.status(404).send('Slides not found');
            }

            const slide = material.files.find(slide => slide._id.toString() === slideID);

            if (!slide) {
            return res.status(404).send('file not found');
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
        }

        if(data==='slide'){
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
        }


    }catch(e){
        next(e)
    }
}


module.exports.delete = async(req,res,next)=>{
    try{
        const{subjectID,sectionID,deleteObjID} = req.params
        const{data} = req.query

        if(data==='courseMaterials'){
            const materialIdToDelete = deleteObjID;
            await Material.updateOne(
                            { 'courseMaterials._id': materialIdToDelete },
                            { $pull: { courseMaterials: { _id: materialIdToDelete } } },
                        );

            req.flash("success", "Your link has been deleted");
            res.redirect(`/courses/${subjectID}/${sectionID}`);
        }



        if(data==='courseMarks'){
            const materialIdToDelete = deleteObjID;
            await Material.updateOne(
                            { 'courseMarks._id': materialIdToDelete },
                            { $pull: { courseMarks: { _id: materialIdToDelete } } },
                        );

            req.flash("success", "Your link has been deleted");
            res.redirect(`/courses/${subjectID}/${sectionID}`);
        }



        if(data==='slide'){   
            const materialIdToDelete = deleteObjID;

            await Material.updateOne(
                            { 'slides._id': materialIdToDelete },
                            { $pull: { slides: { _id: materialIdToDelete } } },
                        );

            req.flash("success", "Your slide has been deleted");
            res.redirect(`/courses/${subjectID}/${sectionID}`);
        }



        if(data==='file'){   
            const materialIdToDelete = deleteObjID;
            await Material.updateOne(
                            { 'files._id': materialIdToDelete },
                            { $pull: { files: { _id: materialIdToDelete } } },
                        );

            req.flash("success", "Your file has been deleted");
            res.redirect(`/courses/${subjectID}/${sectionID}`);
        }
    }catch(e){
        next(e)
    }
}

module.exports.update = async(req,res,next)=>{
    try {
        
        const{subjectID,sectionID,updateObjID} = req.params
        const{data} = req.query

        const { link, linkName, description } = req.body;

        if(data==='courseMaterials'){

            const material = await Material.findOne();

            if (!material) {
              return res.status(404).json({ msg: 'Material document not found' });
            }
        
            const courseMaterialIndex = material.courseMaterials.findIndex(cm => cm._id.toString() === updateObjID.toString());

            if (courseMaterialIndex === -1) {
                return res.status(404).json({ msg: 'Course material not found' });
            }

            material.courseMaterials[courseMaterialIndex].link = link;
            material.courseMaterials[courseMaterialIndex].linkName = linkName;
            material.courseMaterials[courseMaterialIndex].description = description;
            material.courseMaterials[courseMaterialIndex].subjectID = subjectID;
            material.courseMaterials[courseMaterialIndex].sectionID = sectionID;

            await material.save();


            req.flash("success", "Your link has been updated");
            res.redirect(`/courses/${subjectID}/${sectionID}`);
        }

        if(data==='courseMarks'){
            const material = await Material.findOne();

            if (!material) {
              return res.status(404).json({ msg: 'Material document not found' });
            }
        
            const courseMaterialIndex = material.courseMarks.findIndex(cm => cm._id.toString() === updateObjID.toString());

            if (courseMaterialIndex === -1) {
                return res.status(404).json({ msg: 'Course material not found' });
            }

            material.courseMarks[courseMaterialIndex].link = link;
            material.courseMarks[courseMaterialIndex].linkName = linkName;
            material.courseMarks[courseMaterialIndex].description = description;
            material.courseMarks[courseMaterialIndex].subjectID = subjectID;
            material.courseMarks[courseMaterialIndex].sectionID = sectionID;

            await material.save();


            req.flash("success", "Your link has been updated");
            res.redirect(`/courses/${subjectID}/${sectionID}`);
        }

    } catch (e) {
        next(e)
    }
}