const express = require("express");
const router = new express.Router();
const User = require("../models/user"); // import model
const auth = require("../middleware/auth.js");
const { sendWelcomeEmail, sendCancelEmail } = require("../emails/account");
const multer = require("multer");

router.post("/users", async (req, res) => {
  // Create new user
  const user = new User(req.body);
  try {
    await user.save();
    sendWelcomeEmail(user.email, user.name);
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }

  // user
  //   .save()
  //   .then(() => {
  //     res.send(user);
  //   })
  //   .catch(error => {
  //     res.status(400).send(error);
  //   });
});

router.get("/users/me", auth, async (req, res) => {
  // Find all users
  res.send(req.user);
});

router.post("/users/login", async (req, res) => {
  // User login
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    console.log(e);
    res.status(400).send();
  }
});

router.post("/user/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body); // Will return the key in req.body, which is an object
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every(update => {
    return allowedUpdates.includes(update);
  });

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    updates.forEach(update => {
      req.user[update] = req.body[update];
    }); // In order to use middleware(schema) have to use save

    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    // const deleteUser = await User.findByIdAndDelete(req.user._id);
    // if (!deleteUser) {
    //   return res.status(400).send("Can't find this user");
    // }
    await req.user.remove();
    sendCancelEmail(req.user.email, req.user.name);
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

const upload = multer({
  // dest: "avatars",    since it will refresh the folder online, image will be lost through this way.
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jepg|png)$/)) {
      return cb(new Error("Please upload a jpg/jepg/png file"));
    }
    cb(undefined, true);
  }
});

router.post(
  "/users/me/avatar",
  auth,
  upload.single("upload"),
  async (req, res) => {
    console.log(req.file); //contain all the information about this file.
    req.user.avatar = req.file.buffer; // store "buffer" attribute into user model
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status("400").send({ error: error.message });
  } //Error Handler
);

router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new Error();
    }
    res.set("Content-Type", "image/jpg");
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send();
  }
});

module.exports = router;
