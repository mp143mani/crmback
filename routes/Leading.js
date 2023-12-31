const express = require("express");
const router = express.Router();
const { mongoose, usersModel } = require("../DatabaseSchema.jsLeads");
const { mongodb, dbName, dbUrl } = require("../Database");
const { createToken, jwtDecode, validate, roleAdmin } = require("../auth");

mongoose.connect(dbUrl);

router.get("/get", async (req, res) => {
  let users = await usersModel.find();
  res.send({
    statusCode: 200,
    data: users,
  });
});

router.get("/getLeadLength", async (req, res) => {
  let users = await usersModel.find();
  res.send({
    statusCode: 200,
    data: users.length,
  });
});

router.post("/leadAdd", async (req, res) => {
  try {
    let user = await usersModel.find({ email: req.body.email });
    if (user.length) {
      res.send({
        statusCode: 400,
        message: "lead Already Exists",
      });
    } else {
      let newUser = await usersModel.create(req.body);
      res.send({
        statusCode: 200,
        message: "Lead added Successfull",
      });
    }
  } catch (error) {
    console.log(error);
    res.send({ statusCode: 200, message: "Internal Server Error", error });
  }
});

router.delete("/delete-lead/:id", async (req, res) => {
  try {
    let user = await usersModel.find({ _id: mongodb.ObjectId(req.params.id) });
    if (user.length) {
      let users = await usersModel.deleteOne({
        _id: mongodb.ObjectId(req.params.id),
      });
      res.send({ statusCode: 200, message: "User deleted successfully" });
    } else res.send({ statusCode: 400, message: "User does not exists" });
  } catch (error) {
    console.log(error);
    res.send({ statusCode: 400, message: "Internal Server Error", error });
  }
});

router.get("/edit-lead/:id", async (req, res) => {
  try {
    let user = await usersModel.findOne({
      _id: mongodb.ObjectId(req.params.id),
    });
    console.log(user);
    if (user) {
      res.send(user);
    } else res.send({ statusCode: 400, message: "User does not exists" });
  } catch (error) {
    console.log(error);
    res.send({ statusCode: 400, message: "Internal Server Error", error });
  }
});

router.put("/edit-lead/:id", async (req, res) => {
  try {
    let user = await usersModel.findOne({
      _id: mongodb.ObjectId(req.params.id),
    });
    console.log(user);
    if (user) {
      user.leadName = req.body.leadName;
      user.company = req.body.company;
      user.email = req.body.email;
      user.mobileNumber = req.body.mobileNumber;
      user.status = req.body.status;
      await user.save();
      res.send({ statusCode: 200, message: "User data saved successfully" });
    } else res.send({ statusCode: 400, message: "User does not exists" });
  } catch (error) {
    console.log(error);
    res.send({ statusCode: 400, message: "Internal Server Error", error });
  }
});

module.exports = router;
