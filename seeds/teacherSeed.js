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


const seedUser = async () => {
  // await User.deleteMany({});
  for (let i = 0; i < 30; i++) {
    const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const newUser = new User({
        email:`fahimarefin5${i}@gmail.com`,
        firstname:randomFirstName,
        lastname:randomLastName+' '+'(Faculty)',
        room:`20${i}`,
        phoneNumber:`01550212345`,
        username:`02218100${i}`,
        tag:'faculty'
    });
    await User.register(newUser,"1234");
  }
};

seedUser().then(() => {
  //async func can be then able bcz it returns promise
  console.log("saved 30 Teacher");
  mongoose.connection.close(); //close connection
});
