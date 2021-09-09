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
/*
const ReportSearch = (req, res) => {
    if (req.body["report_role"] == '' && req.body["report_department"] == '' && req.body["report_role_number"] == '' && req.body["report_batch"] == '' && req.body["report_book_id"] == '') {
        db.all(`SELECT * FROM FullReport ORDER BY id`, (err, full_report) => {
            res.render("report", {
                export_msg: null,
                reports: full_report,
                username: req.cookies.nscet.username,
            });
        });
    } else {
        query = `SELECT * FROM FullReport WHERE roll_number LIKE ? AND role LIKE ? AND book_id LIKE ? AND department LIKE ? AND batch LIKE ?`
        search_values = [
            '%' + req.body["report_role_number"] + '%',
            '%' + req.body["report_role"] + '%',
            '%' + req.body["report_book_id"] + '%',
            '%' + req.body["report_department"] + '%',
            '%' + req.body["report_batch"] + '%'
        ]
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
        })
    }

}
*/
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
            export_msg: `File Exported To ${path.join(__dirname, "../")}\\GeneratedFiles\\Reports\\`,
            reports: full_report,
            username: req.cookies.nscet.username,
        });
    });
    /*
    if (req.body["report_role"] == '' && req.body["report_department"] == '' && req.body["report_role_number"] == '' && req.body["report_batch"] == '' && req.body["report_book_id"] == '') {
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
                export_msg: `File Exported To ${path.join(__dirname, "../")}\\GeneratedFiles\\Reports\\`,
                reports: full_report,
                username: req.cookies.nscet.username,
            });
        });
    } else {
        query = `SELECT * FROM Full Report WHERE roll_number LIKE ? AND role LIKE ? AND book_id LIKE ? AND department LIKE ? AND batch LIKE ? ORDER BY id DESC`
        search_values = [
            '%' + req.body["report_role_number"] + '%',
            '%' + req.body["report_role"] + '%',
            '%' + req.body["report_book_id"] + '%',
            '%' + req.body["report_department"] + '%',
            '%' + req.body["report_batch"] + '%'
        ]
        db.all(query, search_values, (err, search_result) => {
            var xls = json2xls(search_result);
            fs.writeFileSync(
                `GeneratedFiles/Reports/FullReport${
                today_date + "-" + todayTime.getHours() + todayTime.getMinutes()
              }.xlsx`,
                xls,
                "binary"
            );
            res.render("report", {
                export_msg: `File Exported To ${path.join(__dirname, "../")}\\GeneratedFiles\\Reports\\`,
                reports: search_result,
                username: req.cookies.nscet.username,
            });
        })
    }
*/
};

module.exports = { ReportGet, ReportPostExport };