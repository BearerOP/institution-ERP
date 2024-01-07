const express = require("express");
const student_login = express.Router();
// const user_auth = require('../../middlewares/user_auth');

const {
  
    student_login_save,
  
} = require("../controllers/student_login_controller");

student_login.post("/student_login_save",student_login_save )

module.exports = student_login;
