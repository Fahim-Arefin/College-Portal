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

const sec = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
const y = ["1styear", "2ndyear"];


const seedUser = async () => {
  await User.deleteMany({});
  for (let i = 0; i < 30; i++) {
    const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const rand0to9 = Math.floor(Math.random() * 10);
    const rand0to1 = Math.floor(Math.random() * 2);
    
    const newUser = new User({
      email: `mfahim18123${i}@bscse.uiu.ac.bd`,
      firstname: randomFirstName,
      lastname: randomLastName,
      section: sec[rand0to9],
      year: y[rand0to1],
      username: `01118100${i}`,
      tag:'student',
      phoneNumber:'01814221195'
    });
    await User.register(newUser, "1234");
  }
};

seedUser().then(() => {
  //async func can be then able bcz it returns promise
  console.log("saved 30 student");
  mongoose.connection.close(); //close connection
});
