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
  if (req.body["report_from_date"] != "" && req.body["report_to_date"] != ""){
    query = `SELECT * FROM FullReport WHERE date_verifier >= ? AND date_verifier <= ? AND role LIKE ? AND roll_number LIKE ? AND book_id LIKE ? AND department LIKE ? AND batch LIKE ? ORDER BY date_verifier`
    value = [req.body["report_from_date"],req.body["report_to_date"],
    "%" + req.body["report_role"] + "%",
    "%" + req.body["report_role_number"] + "%",
    "%" + req.body["report_book_id"] + "%",
    "%" + req.body["report_department"] + "%",
    "%" + req.body["report_batch"] + "%"]
    db.all(query,value,(err,result)=>{
      res.render("report", {
        export_msg: null,
        reports: result,
        username: req.cookies.nscet.username,
      });
    })
  }else{
    query = `SELECT * FROM FullReport WHERE role LIKE ? AND roll_number LIKE ? AND book_id LIKE ? AND department LIKE ? AND batch LIKE ? ORDER BY date_verifier`;
    value = ["%" + req.body["report_role"] + "%" ,
    "%" + req.body["report_role_number"] + "%",
    "%" + req.body["report_book_id"] + "%",
    "%" + req.body["report_department"] + "%",
    "%" + req.body["report_batch"] + "%"];
    db.all(query,value,(err,result)=>{
      db.all(query,value,(err,result)=>{
        res.render("report", {
          export_msg: null,
          reports: result,
          username: req.cookies.nscet.username,
        });
      });
    })
  };
};

const ReportPostExport = (req, res) => {
  var todayTime = new Date();
  var month = todayTime.getMonth() + 1;
  var date = todayTime.getDate();
  var year = todayTime.getFullYear();
  var today_date = date + "-" + month + "-" + year;

  if (req.body["report_from_date"] != "" && req.body["report_to_date"] != ""){
    query = `SELECT id,roll_number,role,book_id,validation_date,is_delayed,book_title,department,batch,issued_date,return_date FROM FullReport WHERE date_verifier >= ? AND date_verifier <= ? AND role LIKE ? AND roll_number LIKE ? AND book_id LIKE ? AND department LIKE ? AND batch LIKE ? ORDER BY date_verifier`
    value = [req.body["report_from_date"],req.body["report_to_date"],
    "%" + req.body["report_role"] + "%",
    "%" + req.body["report_role_number"] + "%",
    "%" + req.body["report_book_id"] + "%",
    "%" + req.body["report_department"] + "%",
    "%" + req.body["report_batch"] + "%"]
    db.all(query,value,(err,result)=>{
        var xls = json2xls(result);
        fs.writeFileSync(`GeneratedFiles/Reports/FullReport${today_date +"-" +todayTime.getHours() +todayTime.getMinutes()}.xlsx`,xls,"binary");
        res.render("report", {
        export_msg:
          "File Exported To ../LibraryManagementSystem/GeneratedFiles/Reports/",
        reports: result,
        username: req.cookies.nscet.username,
      });
    })
  }else{
    query = `SELECT id,roll_number,role,book_id,validation_date,is_delayed,book_title,department,batch,issued_date,return_date FROM FullReport WHERE role LIKE ? AND roll_number LIKE ? AND book_id LIKE ? AND department LIKE ? AND batch LIKE ? ORDER BY date_verifier`;
    value = ["%" + req.body["report_role"] + "%" ,
    "%" + req.body["report_role_number"] + "%",
    "%" + req.body["report_book_id"] + "%",
    "%" + req.body["report_department"] + "%",
    "%" + req.body["report_batch"] + "%"];
    db.all(query,value,(err,result)=>{
        var xls = json2xls(result);
        fs.writeFileSync(`GeneratedFiles/Reports/FullReport${today_date +"-" +todayTime.getHours() +todayTime.getMinutes()}.xlsx`,xls,"binary");
        res.render("report", {
          export_msg:
            "File Exported To ../LibraryManagementSystem/GeneratedFiles/Reports/",
          reports: result,
          username: req.cookies.nscet.username,
        });
    })
  };
}

module.exports = { ReportGet, ReportPostExport, ReportSearch };
