const sqlite3 = require("sqlite3").verbose();
var json2xls = require("json2xls");
const fs = require("fs");

const db = new sqlite3.Database("./database/Master_DB.db", (err) => {
  if (err) {
    return console.error(err.message);
  } else {
    //console.log("Report Database Connected");
  }
});

const ReportGet = (req, res) => {
  db.all(`SELECT * FROM FullReport ORDER BY id`, (err, full_report) => {
    res.render("report", {
      export_msg: null,
      reports: full_report,
      username: req.cookies.nscet.username,
    });
  });
};

const ReportPostExport = (req, res) => {
  var todayTime = new Date();
  var month = todayTime.getMonth() + 1;
  var date = todayTime.getDate();
  var year = todayTime.getFullYear();
  var today_date = date + "-" + month + "-" + year;
  db.all(`SELECT * FROM FullReport ORDER BY id`, (err, full_report) => {
    var xls = json2xls(full_report);
    fs.writeFileSync(
      `GeneratedFiles/Reports/FullReport${
        today_date + "-" + todayTime.getHours() + todayTime.getMinutes()
      }.xlsx`,
      xls,
      "binary"
    );
    res.render("report", {
      export_msg: "File Exported To {%App Path%}/GeneratedFiles/Reports/",
      reports: full_report,
      username: req.cookies.nscet.username,
    });
  });
};

module.exports = { ReportGet, ReportPostExport };
