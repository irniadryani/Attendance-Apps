const express = require("express");
const app = express();
const sequelize = require("./config/connection.js");
const bodyParser = require('body-parser');
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const UserRoute = require("./routes/UserRoute");
const PermissionRoute = require("./routes/PermissionRoute");
const AuthRoute = require("./routes/AuthRoute");
const AttendanceRoute = require("./routes/AttendanceRoute.js");
const DailyReportRoute = require("./routes/DailyReportRoute.js");
const AnnouncementRoute = require("./routes/AnnouncementRoute.js");
const LeavesRoute = require("./routes/LeavesRoute.js");
const SettingRoute = require("./routes/SettingRoute.js");
const LimitRoute = require("./routes/LimitRoute.js");

dotenv.config();

const port = process.env.APP_PORT;

//Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        `http://10.10.101.193:${port}`,
        `http://192.168.231.91:${port}`,
        `http://localhost:${port}`,
        "http://10.10.101.193:3000",
        "http://192.168.231.91:3000",
        "http://localhost:3000",
      ];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // Allow the request
      } else {
        callback(new Error("Not allowed by CORS")); // Deny the request
      }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
    allowedHeaders: "Content-Type, Authorization",
  })
);

// Middleware for handling file uploads
app.use(fileUpload());
app.use(cookieParser());
app.use(express.json()); //menerima data dalam bentuk json
app.use("/images", express.static("public/images"));
app.use('/defaultImage', express.static('public/defaultImage'));
app.use('/fileUploads', express.static('public/fileUploads'));
app.use('/attendance', express.static('public/attendance'));
app.use(UserRoute);
app.use(PermissionRoute);
app.use(AuthRoute);
app.use(AttendanceRoute);
app.use(DailyReportRoute);
app.use(AnnouncementRoute);
app.use(LeavesRoute);
app.use(SettingRoute);
app.use(LimitRoute);

app.post("/ping", (req, res) => {
  res.send("pong");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
