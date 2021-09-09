const sqlite3 = require("sqlite3").verbose();
var json2xls = require("json2xls");
const fs = require("fs");
const path = require("path");

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

const ReportSearch = (req, res) => {
  if (
    !(req.body["report_from_date"] == "" && req.body["report_to_date"] == "")
  ) {
    from_to_dates_report = [];
    from = db.all(`SELECT * FROM FullReport`, (err, full_report) => {
      for (let i = 0; i < full_report.length; i++) {
        console.log(full_report[i].return_date);
        if (
          new Date(full_report[i].return_date) >=
            new Date(req.body["report_from_date"]) &&
          new Date(full_report[i].return_date) <=
            new Date(req.body["report_to_date"])
        ) {
          from_to_dates_report.push(full_report[i]);
        }
      }
      res.render("report", {
        export_msg: null,
        reports: from_to_dates_report,
        username: req.cookies.nscet.username,
      });
    });
  } else {
    if (
      req.body["report_from_date"] == "" &&
      req.body["report_to_date"] == "" &&
      req.body["report_role"] == "" &&
      req.body["report_department"] == "" &&
      req.body["report_role_number"] == "" &&
      req.body["report_batch"] == "" &&
      req.body["report_book_id"] == ""
    ) {
      db.all(`SELECT * FROM FullReport ORDER BY id`, (err, full_report) => {
        res.render("report", {
          export_msg: null,
          reports: full_report,
          username: req.cookies.nscet.username,
        });
      });
    } else {
      if (req.body["report_role"] == "Student") {
        query = `SELECT * FROM FullReport WHERE roll_number LIKE ? AND role LIKE ? AND book_id LIKE ? AND department LIKE ? AND batch LIKE ? ORDER BY id DESC`;
        search_values = [
          "%" + req.body["report_role_number"] + "%",
          "%" + req.body["report_role"] + "%",
          "%" + req.body["report_book_id"] + "%",
          "%" + req.body["report_department"] + "%",
          "%" + req.body["report_batch"] + "%",
        ];
        db.all(query, search_values, (err, search_result) => {
          if (search_result.length == 0) {
            res.render("report", {
              export_msg: null,
              reports: [],
              username: req.cookies.nscet.username,
            });
          } else {
            res.render("report", {
              export_msg: null,
              reports: search_result,
              username: req.cookies.nscet.username,
            });
          }
        });
      } else {
        query = `SELECT * FROM FullReport WHERE roll_number LIKE ? AND role LIKE ? AND book_id LIKE ? AND department LIKE ? ORDER BY id DESC`;
        search_values = [
          "%" + req.body["report_role_number"] + "%",
          "%" + req.body["report_role"] + "%",
          "%" + req.body["report_book_id"] + "%",
          "%" + req.body["report_department"] + "%",
        ];
        db.all(query, search_values, (err, search_result) => {
          if (search_result.length == 0) {
            res.render("report", {
              export_msg: null,
              reports: [],
              username: req.cookies.nscet.username,
            });
          } else {
            res.render("report", {
              export_msg: null,
              reports: search_result,
              username: req.cookies.nscet.username,
            });
          }
        });
      }
    }
  }
};

const ReportPostExport = (req, res) => {
  var todayTime = new Date();
  var month = todayTime.getMonth() + 1;
  var date = todayTime.getDate();
  var year = todayTime.getFullYear();
  var today_date = year + "-" + month + "-" + date;
  if (
    !(req.body["report_from_date"] == "" && req.body["report_to_date"] == "")
  ) {
    from_to_dates_report = [];
    from = db.all(`SELECT * FROM FullReport`, (err, full_report) => {
      for (let i = 0; i < full_report.length; i++) {
        console.log(full_report[i].return_date);
        if (
          new Date(full_report[i].return_date) >=
            new Date(req.body["report_from_date"]) &&
          new Date(full_report[i].return_date) <=
            new Date(req.body["report_to_date"])
        ) {
          from_to_dates_report.push(full_report[i]);
        }
      }
      var xls = json2xls(from_to_dates_report);
      fs.writeFileSync(
        `GeneratedFiles/Reports/FullReport${
          today_date + "-" + todayTime.getHours() + todayTime.getMinutes()
        }.xlsx`,
        xls,
        "binary"
      );
      res.render("report", {
        export_msg: `File Exported To ${path.join(
          __dirname,
          "../"
        )}\\GeneratedFiles\\Reports\\`,
        reports: from_to_dates_report,
        username: req.cookies.nscet.username,
      });
    });
  } else {
    if (
      req.body["report_role"] == "" &&
      req.body["report_department"] == "" &&
      req.body["report_role_number"] == "" &&
      req.body["report_batch"] == "" &&
      req.body["report_book_id"] == ""
    ) {
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
          export_msg: `File Exported To ${path.join(
            __dirname,
            "../"
          )}\\GeneratedFiles\\Reports\\`,
          reports: full_report,
          username: req.cookies.nscet.username,
        });
      });
    } else {
      if (req.body["report_role"] == "Student") {
        query = `SELECT * FROM FullReport WHERE roll_number LIKE ? AND role LIKE ? AND book_id LIKE ? AND department LIKE ? AND batch LIKE ? ORDER BY id DESC`;
        search_values = [
          "%" + req.body["report_role_number"] + "%",
          "%" + req.body["report_role"] + "%",
          "%" + req.body["report_book_id"] + "%",
          "%" + req.body["report_department"] + "%",
          "%" + req.body["report_batch"] + "%",
        ];
        db.all(query, search_values, (err, search_result_export) => {
          if (!(search_result_export.length == 0)) {
            var xls = json2xls(search_result_export);
            fs.writeFileSync(
              `GeneratedFiles/Reports/FullReport${
                today_date + "-" + todayTime.getHours() + todayTime.getMinutes()
              }.xlsx`,
              xls,
              "binary"
            );
            res.render("report", {
              export_msg: `File Exported To ${path.join(
                __dirname,
                "../"
              )}\\GeneratedFiles\\Reports\\`,
              reports: search_result_export,
              username: req.cookies.nscet.username,
            });
          } else {
            res.render("report", {
              export_msg: null,
              reports: search_result_export,
              username: req.cookies.nscet.username,
            });
          }
        });
      } else {
        query = `SELECT * FROM FullReport WHERE roll_number LIKE ? AND role LIKE ? AND book_id LIKE ? AND department LIKE ? ORDER BY id DESC`;
        search_values = [
          "%" + req.body["report_role_number"] + "%",
          "%" + req.body["report_role"] + "%",
          "%" + req.body["report_book_id"] + "%",
          "%" + req.body["report_department"] + "%",
        ];
        db.all(query, search_values, (err, search_result_export) => {
          if (!(search_result_export.length == 0)) {
            var xls = json2xls(search_result_export);
            fs.writeFileSync(
              `GeneratedFiles/Reports/FullReport${
                today_date + "-" + todayTime.getHours() + todayTime.getMinutes()
              }.xlsx`,
              xls,
              "binary"
            );
            res.render("report", {
              export_msg: `File Exported To ${path.join(
                __dirname,
                "../"
              )}\\GeneratedFiles\\Reports\\`,
              reports: search_result_export,
              username: req.cookies.nscet.username,
            });
          } else {
            res.render("report", {
              export_msg: null,
              reports: search_result_export,
              username: req.cookies.nscet.username,
            });
          }
        });
      }
    }
  }
};

module.exports = { ReportGet, ReportPostExport, ReportSearch };
