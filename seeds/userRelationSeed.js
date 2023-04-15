const User = require("../models/user");
const mongoose = require("mongoose");
const {firstNames,lastNames} = require('./nameSeed')

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


async function findAllUsers() {
 
  const student = await User.find({ tag: 'student' });
  const faculty = await User.find({ tag: 'faculty' });
  const guardian = await User.find({ tag: 'guardian' });

  for(let i=0;i<30;i++){
    student[i].guardian = guardian[i]
    if(i<15){
        student[i].classTeacher = faculty[0]
    }
    else{
        student[i].classTeacher = faculty[1]
    }
    
    await student[i].save()
  }
}

async function main() {
    await findAllUsers(); // wait for the findAllUsers function to complete
    const stdWithguardian = await User.find({tag:'student'}).populate('guardian').populate('classTeacher')  
    console.log(stdWithguardian)
}
main(); 

//  seedUser = async () => {
//   // await User.deleteMany({});
//   for (let i = 0; i < 30; i++) {
//   }
// };

// seedUser().then(() => {
//   //async func can be then able bcz it returns promise
//   console.log("saved 10 student");
//   mongoose.connection.close(); //close connection
// });
