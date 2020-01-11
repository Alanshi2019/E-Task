const mongodb = require("mongodb");
const { MongoClient, ObjectID } = mongodb;

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

// const id = new ObjectID();
// console.log(id);
// console.log(id.getTimestamp());

MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true },
  (error, client) => {
    if (error) {
      return console.log("Unable to connect to database!");
    }
    const db = client.db(databaseName);
    // db.collection("users").insertOne(
    //   {
    //     _id: id,
    //     name: "Wai",
    //     age: "25"
    //   },
    //   (error, result) => {
    //     if (error) {
    //       return console.log("Unable to insert user");
    //     }
    //     console.log(result.ops); //[ { name: 'Wai', age: '25', _id: 5dfe3f4603d8f49bcc00d375 } ]
    //   }
    // );

    // db.collection("task").insertMany(
    //   [
    //     {
    //       description: "The first task",
    //       completed: true
    //     },
    //     {
    //       description: "The second task",
    //       completed: true
    //     },
    //     {
    //       description: "The third task",
    //       completed: false
    //     }
    //   ],
    //   (error, result) => {
    //     if (error) {
    //       console.log("Unable to insert task");
    //     }
    //     console.log(result.ops);
    //   }
    // );
    // db.collection("users").findOne({ name: "Jen", age: "1" }, (error, user) => {
    //   if (error) {
    //     return console.log("Unable to fetch");
    //   }
    //   console.log(user);
    // });

    // db.collection("users")
    //   .find({ age: "25" })
    //   .toArray((error, users) => {
    //     console.log(users);
    //   }); //find return a "cursor", which does not have a callback argument.

    // db.collection("task").findOne(
    //   { _id: new ObjectID("5dfe42083858239c10d50e93") },
    //   (error, user) => {
    //     if (error) {
    //       return console.log("Unable to fetch");
    //     }
    //     console.log(user);
    //   }
    // );

    // db.collection("task")
    //   .find({ completed: false })
    //   .toArray((error, result) => {
    //     if (error) {
    //       return console.log("Unable to fetch");
    //     }
    //     console.log(result);
    //   });
    // db.collection("users")
    //   .updateOne(
    //     {
    //       _id: new ObjectID("5dfe3f4603d8f49bcc00d375")
    //     },
    //     {
    //       //   $set: {
    //       //     name: "Mike"
    //       //   }
    //       $inc: {
    //         age: 3
    //       } // 自增
    //     }
    //   )
    //   .then(result => {
    //     console.log(result);
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
    db.collection("task")
      .updateMany(
        {
          completed: false
        },
        {
          $set: {
            completed: true
          }
        }
      )
      .then(result => {
        console.log("Update successed" + result.modifiedCount);
      })
      .catch(error => console.log("Unable to update many!"));
  }
);
