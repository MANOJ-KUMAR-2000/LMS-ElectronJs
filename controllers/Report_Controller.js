const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database/Master_DB.db", (err) => {
  if (err) {
    return console.error(err.message);
  } else {
    console.log("Report Database Connected");
  }
});

const ReportGet = (req, res) => {
  res.render("report", { reports: [], username: req.cookies.nscet.username });
};

const ReportPostData = (req, res) => {
  console.log(req.body);
  if (!(req.body["report_book_id"] == "")) {
    db.all(
      `SELECT * FROM FullReport WHERE book_id = ?`,
      [req.body["report_book_id"]],
      (err, allbook_report) => {
        res.render("report", {
          reports: allbook_report,
          username: req.cookies.nscet.username,
        });
      }
    );
  }
  if (!(req.body["report_roll_number"] == "")) {
    db.all(
      `SELECT * FROM FullReport WHERE roll_number = ?`,
      [req.body["report_roll_number"]],
      (err, allroll_report) => {
        res.render("report", {
          reports: allroll_report,
          username: req.cookies.nscet.username,
        });
      }
    );
  }
  common_query = `SELECT * FROM FullReport WHERE role LIKE ? AND department LIKE ? AND batch LIKE ? ORDER BY roll_number`;
};

const ReportPostExport = (req, res) => {
  console.log(req.body);
};

module.exports = { ReportGet, ReportPostData, ReportPostExport };
