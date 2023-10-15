const express = require("express");
const router = express.Router();
const { usersModel } = require("../dbSchemaReq");

// Route to get all requirements
router.get("/get", async (req, res) => {
  try {
    const users = await usersModel.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to get the number of requirements
router.get("/getReqLength", async (req, res) => {
  try {
    const userCount = await usersModel.countDocuments();
    res.status(200).json({ reqCount: userCount });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to add a new requirement
router.post("/ReqAdd", async (req, res) => {
  try {
    const existingUser = await usersModel.findOne({ email: req.body.email });
    if (existingUser) {
      res.status(400).json({ message: "Requirement Already Exists" });
    } else {
      const newUser = await usersModel.create(req.body);
      res.status(200).json({ message: "Requirement added Successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to delete a requirement by ID
router.delete("/delete-Req/:id", async (req, res) => {
  try {
    const deletedUser = await usersModel.findByIdAndDelete(req.params.id);
    if (deletedUser) {
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(400).json({ message: "User does not exist" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to edit a requirement by ID
router.put("/edit-Req/:id", async (req, res) => {
  try {
    const updatedUser = await usersModel.findByIdAndUpdate(req.params.id, req.body);
    if (updatedUser) {
      res.status(200).json({ message: "User data saved successfully" });
    } else {
      res.status(400).json({ message: "User does not exist" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
