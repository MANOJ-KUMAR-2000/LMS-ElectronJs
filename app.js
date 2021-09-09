const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const fileUpload = require("express-fileupload");

const HomeRoutes = require("./routes/Home_Routes");
const AuthRoutes = require("./routes/Auth_Routes");
const UploadRoutes = require("./routes/Upload_Routes");
const AddViewRoutes = require("./routes/AddView_Routes");
const RecordRoutes = require("./routes/Record_Routes");
const ReportRoutes = require("./routes/Report_Routes");
const IssueReturnRoutes = require("./routes/IssueReturn_Routes");

const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(fileUpload());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.listen(52383);


app.use("/", HomeRoutes)
app.use("/authentication", AuthRoutes);
app.use("/record", RecordRoutes);
app.use("/add-view", AddViewRoutes);
app.use("/upload", UploadRoutes);
app.use("/issue-return", IssueReturnRoutes);
app.use("/reports", ReportRoutes);