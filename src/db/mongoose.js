const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

// const newTask = new Task({
//   description: "I'm a new grad student"
// });

// newTask
//   .save()
//   .then(() => {
//     console.log("Yeaaaaaaah~!");
//   })
//   .catch(error => {
//     console.log(error);
//   });

// const me = new User({
//   name: "   Mike", //name: 'Mike',
//   email: "MikE@gmail.com", //   email: 'mike@gmail.com',
//   password: "pasdfsdfsdf123123"
// });
// me.save()
//   .then(() => {
//     console.log(me);
//   })
//   .catch(error => {
//     console.log("Error!", error);
//   });
