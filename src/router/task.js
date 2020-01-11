const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth.js");
const Task = require("../models/task"); // import model

router.post("/tasks", auth, async (req, res) => {
  //create a new task
  // const task = new Task(req.body);
  const task = new Task({
    ...req.body,
    owner: req.user._id
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});
//GET /tasks?completed=true
//GET /tasks?limit = 10 & skip = 10(跳过)
//GET /tasks?sortBy=createAt:desc
router.get("/tasks", auth, async (req, res) => {
  const match = {};
  const sort = {};
  if (req.query.completed) {
    match.completed = req.query.completed === "true" ? true : false;
  }
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1; // -1=desc, 1=asc
  }

  try {
    // const users = await Task.find(temp).limit(2);
    // res.send(users);

    await req.user
      .populate({
        path: "tasks",
        match,
        options: {
          limit: parseInt(req.query.limit),
          // skip: parseInt(req.query.limit) * (parseInt(req.query.skip) - 1)
          skip: parseInt(req.query.skip),
          sort
        }
      })
      .execPopulate();
    res.send(req.user.tasks);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    // const task = await Task.findById(id);
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send();
    }

    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const updateKeys = Object.keys(req.body);
  const allowedUpdates = ["completed", "description"];
  const isValidOperation = updateKeys.every(updateKey => {
    return allowedUpdates.includes(updateKey);
  });

  if (!isValidOperation) {
    return res.status(400).send("Invalid updates!");
  }
  try {
    const _id = req.params.id;
    const updateTask = await Task.findOne({ _id, owner: req.user._id });

    if (!updateTask) {
      return res.status(400).send("Can'f find this task");
    }

    updateKeys.forEach(updateKey => {
      updateTask[updateKey] = req.body[updateKey];
    });
    await updateTask.save();

    res.status(200).send(updateTask);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const deleteTask = await Task.findOneAndDelete({
      _id,
      owner: req.user._id
    });

    if (!deleteTask) {
      return res.status(400).send("Can't find this task");
    }
    res.send(deleteTask);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
