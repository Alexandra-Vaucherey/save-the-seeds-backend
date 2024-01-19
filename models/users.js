const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: String,
  firstname: String,
  lastname: String,
  birthday: Date,
  phone: Number,
  picture: Buffer,
  password: String,
  email: String,
  token: String,
  
 });

const User = mongoose.model('users', userSchema);

module.exports = User;