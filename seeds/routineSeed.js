const mongoose = require("mongoose");
const Routine = require("../models/routine");
const User = require("../models/user");
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

const sections = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
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

function getRandomTime() {
  const hours = Math.floor(Math.random() * 8) + 8;
  const minutes = Math.floor(Math.random() * 60);
  return `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
}

function getRandomRoom() {
  return Math.floor(Math.random() * 9) + 201;
}

function getRandomTeacher() {
  
  // console.log(teachers)
  // const teachers = [
  //   "Top G",
  //   "FA karim",
  //   "MA Rahman",
  //   "John Doe",
  //   "Jane Doe",
  //   "Alice Smith",
  //   "Bob Johnson",
  //   "Emily Brown",
  //   "David Lee",
  //   "Karen Chen",
  // ];
  const index = Math.floor(Math.random() * teachers.length);
  return teachers[index];
}

const seedRoutine = async () => {
  await Routine.deleteMany({});
  const routineData = {
    subject: [],
  };

  for (let i = 0; i < subjects.length; i++) {
    const subject = {
      name: subjects[i],
      sec: [],
    };

    for (let j = 0; j < 10; j++) {
      const section = {
        name: sections[j],
        start: getRandomTime(),
        end: getRandomTime(),
        room: getRandomRoom(),
        teacher: getRandomTeacher(),
      };

      subject.sec.push(section);
    }

    routineData.subject.push(subject);
  }

  const newRoutine = new Routine(routineData);

  const data = await newRoutine.save();
  console.log(data)
};

seedRoutine().then((data) => {
  console.log("saved 13 subject with each has 10 section");
  mongoose.connection.close(); //close connection
});



// db.routines.aggregate([
//   { $unwind: "$subject" },
//   { $unwind: "$subject.sec" },
//   { $match: { "subject.sec.name": "A" } },
//   { $group: { _id: "$subject._id", subject: { $first: "$subject" } } },
//   { $project: { _id: 0, "subject.sec": 1, "subject.name": 1 } }
// ])
