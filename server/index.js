const express = require("express");
const app = express();
const sequelize = require("./config/connection.js");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const UserRoute = require("./routes/UserRoute");
const PermissionRoute = require("./routes/PermissionRoute");
const AuthRoute = require("./routes/AuthRoute");
const AttendanceRoute = require("./routes/AttendanceRoute.js");
const DailyReportRoute = require("./routes/DailyReportRoute.js");

dotenv.config();

const port = process.env.APP_PORT;

//Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Check if the origin is allowed
      const allowedOrigins = [
        "http://10.10.101.199:3000",
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
app.use(cookieParser());
app.use(express.json()); //menerima data dalam bentuk json
app.use(UserRoute);
app.use(PermissionRoute);
app.use(AuthRoute);
app.use(AttendanceRoute);
app.use(DailyReportRoute);

app.post("/ping", (req, res) => {
  res.send("pong");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
