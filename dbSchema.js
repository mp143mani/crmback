const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobileNumber: { type: Number, required: true },
  company: { type: String, required: true },
  email: {
    type: String,
    required: true,
    lowercase: true,
    validate: (value) => validator.isEmail(value),
  },
  password: { type: String, required: true },
  role: { type: String, default: 'Employee' },
  createdAt: { type: Date, default: Date.now() },
});

const usersModel = mongoose.model('users', userSchema);

module.exports = { usersModel };
