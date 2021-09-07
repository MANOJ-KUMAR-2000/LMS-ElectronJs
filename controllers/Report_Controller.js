const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database/Master_DB.db", (err) => {
  if (err) {
    return console.error(err.message);
  } else {
    console.log("Report Database Connected");
  }
});

const ReportGet = (req, res) => {
  res.render("report", { username: req.cookies.nscet.username });
};

const ReportPost = (req, res) => {};

module.exports = { ReportGet, ReportPost };
