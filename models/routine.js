const mongoose = require("mongoose");

const SectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  start: {
    type: String,
    required: true,
  },
  end: {
    type: String,
    required: true,
  },
  room: {
    type: Number,
    required: true,
  },
  teacher: {
    type: String,
    required: true,
  }
})

const SubjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  sec: {
    type: [SectionSchema],
    required: true,
  }
})

const RoutineSchema = new mongoose.Schema({
  subject: {
    type: [SubjectSchema],
    required: true,
  }
})

module.exports = mongoose.model("Routine", RoutineSchema);


//translate the schema
// const routine = {
//     subject:[
//         {
//             _id:8217291392213231
//             name:'bangla',
//             sec:[
//                 {
//                 _id:12389123112312
//                 name:'A',
//                 start:'8:00',
//                 end:'9:00',
//                 room:201,
//                 teacher:'Top G'
//                 },
//                 {
//                 _id:12389123112312
//                 name:'B',
//                 start:'9:00',
//                 end:'10:00',
//                 room:202,
//                 teacher:'FA karim'
//                 },
//                 {
//                 _id:12389123112312
//                 name:'C',
//                 start:'11:00',
//                 end:'12:00',
//                 room:203,
//                 teacher:'MA Rahman'
//                 },
//             ]
//         }
//     ]
// }
