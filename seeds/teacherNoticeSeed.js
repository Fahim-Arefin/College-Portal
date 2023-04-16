const mongoose = require("mongoose");
const {firstNames,lastNames} = require('./nameSeed')
const TeacherNotice = require('../models/teachersNotice')
const User = require('../models/user')

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
const subjects = [
  "bangla_1st_paper",
  "bangla_2nd_paper",
  "english_1st_paper",
  "english_2nd_paper",
  "biology_1st_paper",
  "biology_2nd_paper",
  "chemistry_1st_paper",
  "chemistry_2nd_paper",
  "physics_1st_paper",
  "physics_2nd_paper",
  "general_math",
  "higher_math",
  "ict",
];
const teachers = []

async function generateTeacher(){
  const allfaculty = await User.find({tag:'faculty'})
  for(let faculty of allfaculty){
    let fullname = faculty.firstname+" "+faculty.lastname
    teachers.push(fullname)
  }
}
generateTeacher()

function getRandomTeacher() {
  const index = Math.floor(Math.random() * teachers.length);
  return teachers[index];
}

function getRandomsubject() {
  const index = Math.floor(Math.random() * subjects.length);
  return subjects[index];
}

const seedTeacherNotice = async () => {
    await TeacherNotice.deleteMany({});
    for (let i = 0; i < 100; i++) {
        const rand0to9 = Math.floor(Math.random() * 10);
        const teacherNotice = new TeacherNotice({
            noticeHolder:getRandomTeacher(),
            noticeText:'This Notice is Seeded, so its section can not match with the teacher currently taking sections But teacher name is appropiate just the section is randomly seed',
            section:sec[rand0to9],
            subject:getRandomsubject()
        })
        await teacherNotice.save()
    }
  };
  
  seedTeacherNotice().then(() => {
    //async func can be then able bcz it returns promise
    console.log("saved 100 Notices");
    mongoose.connection.close(); //close connection
  });
  