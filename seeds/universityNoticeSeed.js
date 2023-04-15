const mongoose = require("mongoose");
const UniversityNotice = require('../models/universityNotice')

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

const seedUniversityNotice = async () => {
    await UniversityNotice.deleteMany({});
    for (let i = 0; i < 10; i++) {
        const universityNotice = new UniversityNotice({
            noticeHolder:'United International university',
            noticeText:'Keep your readers updated. Always. No one wants to be the last one to know something important. Send them notifications in seconds from the news breaking in. This works brilliantly with breaking news, informing users about cricket scores and news that is time-sensitive.'            
        })
        await universityNotice.save()
    }
  };
  
  seedUniversityNotice().then(() => {
    //async func can be then able bcz it returns promise
    console.log("saved 10 Notices");
    mongoose.connection.close(); //close connection
  });
  