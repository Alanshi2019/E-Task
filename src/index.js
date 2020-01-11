const express = require("express");
require("./db/mongoose"); // To connect to the database
const userRouter = require("./router/user.js");
const taskRouter = require("./router/task.js");
const app = express();
const port = process.env.PORT; //heroku

app.use(express.json()); //parse incoming json into object
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log("Server is up on port" + port);
});
