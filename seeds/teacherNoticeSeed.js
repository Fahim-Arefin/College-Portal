const mongoose = require("mongoose");
const {firstNames,lastNames} = require('./nameSeed')
const TeacherNotice = require('../models/teachersNotice')

//connection with mongoose
//---------------------------------------------------------------------------------------------------------------
mongoose
  .connect("mongodb://localhost:27017/collegePortal") //connected to YelpCamp database
  .then(() => {
    console.log("Mongo connnection successful: ");
  })
  .catch((e) => {
    console.log("Mongo connection failed !!");
    // console.log(e)
  });
//----------------------------------------------------------------------------------------------------------------

const sec = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];


const seedTeacherNotice = async () => {
    await TeacherNotice.deleteMany({});
    for (let i = 0; i < 100; i++) {
        const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const rand0to9 = Math.floor(Math.random() * 10);
        const teacherNotice = new TeacherNotice({
            noticeHolder:randomFirstName+' '+randomLastName,
            noticeText:'The fact that the users had shown interest points to their intent to subscribe. Give them a nudge, remind them about the benefits of subscribing and the exclusive content they get access to. A quick reminder goes a long way.',
            section:sec[rand0to9]
        })
        await teacherNotice.save()
    }
  };
  
  seedTeacherNotice().then(() => {
    //async func can be then able bcz it returns promise
    console.log("saved 100 Notices");
    mongoose.connection.close(); //close connection
  });
  