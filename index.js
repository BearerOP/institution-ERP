require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT;
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { db_connect_student } = require("./src/db/student_db");
const path = require("path");



db_connect_student();
app.use("/public", express.static("public"));
const bodyParser = require("body-parser");
app.use(cookieParser());
app.use(cors({
  origin: '*', 
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "/public")));
app.set("views", path.join(__dirname, "src/views"));
app.use(bodyParser.json()); // To parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));


app.set("view engine", "ejs");

// app.use(checkAuthenticated)
app.use("/api", require("./src/routes/fee_route"));
app.use("/api", require("./src/routes/student_register_route"));
app.use("/api", require("./src/routes/dashboard_route"));
app.use("/api", require("./src/routes/account_settings_routes"));
app.use("/api", require("./src/routes/student_fee_details_routes"));
app.use("/api", require("./src/routes/student_library_routes"));
app.use("/api", require("./src/routes/student_login_routes"));
app.use("/api", require("./src/routes/exam_report_routes"));
app.use("/api", require("./src/routes/assignment_routes.js"));
app.use("/api", require("./src/routes/student_message_sender"));
app.use("/api", require("./src/routes/view_student_attendance_routes"));
app.use("/api", require("./src/routes/add_teacher_route"));
app.use("/api", require("./src/routes/view_teachers_route"));
app.use("/api", require("./src/routes/view_student_profile_routes"));
app.use("/api", require("./src/routes/view_attendance_teacher_side_routes.js"));
app.use("/api", require("./src/routes/view_notifications_teacher_route"));
app.use("/api", require("./src/routes/routes"));
app.use("/api", require("./src/routes/attendanceRoutes"));
app.use("/api", require("./src/routes/login_admin"));
app.use("/api", require("./src/routes/register_admin"));
app.use("/api", require("./src/routes/add_attendance_routes"));
app.use("/api", require("./src/routes/student_view_route"));
app.use("/api", require("./src/routes/view_attendance_routes"));
app.use("/api", require("./src/routes/users_profile_route"));
app.use("/api", require("./src/routes/exam_report_routes"));
app.use("/api", require("./src/routes/assignment_routes.js"));
app.use("/api", require("./src/routes/teacher_profile_routes.js"));
app.use("/api", require("./src/routes/teacher_login_route.js"));
app.use("/api", require("./src/routes/view_all_students_route.js"));
app.use("/api", require("./src/routes/add_books"));
app.use("/api", require("./src/routes/book_issue_route"));
app.use("/api", require("./src/routes/book_manager_routes"));
app.use("/api", require("./src/routes/add_fee_heads_routes"));
app.use("/api", require("./src/routes/logout_admin_route.js"));

app.listen(PORT, () => {
  console.log(
    `Server running on port http://localhost:${PORT}/api/login_admin`
  );
});
