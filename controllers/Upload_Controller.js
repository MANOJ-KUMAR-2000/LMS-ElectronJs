const sqlite3 = require("sqlite3").verbose();
const XLSX = require("xlsx");
var json2xls = require("json2xls");
const fs = require("fs");

const db = new sqlite3.Database("./database/Master_DB.db", (err) => {
    if (err) {
        return console.error(err.message);
    } else {
        //console.log("Upload Database Connected");
    }
});

function ExtractData(workbook) {
    let tmp_data = [];
    SheetNames = workbook.SheetNames;
    for (let i = 0; i < SheetNames.length; i++) {
        const temp = XLSX.utils.sheet_to_json(
            workbook.Sheets[workbook.SheetNames[i]]
        );
        temp.forEach((res) => {
            tmp_data.push(res);
        });
    }
    return tmp_data;
}

const UploadStudents = (req, res) => {
    var workbook = XLSX.read(req.files["file"].data);
    const data = ExtractData(workbook);
    console.log(JSON.stringify(Object.keys(data[0])))
    if (
        JSON.stringify(Object.keys(data[0])) ==
        JSON.stringify(["rollno", "name", "batch", "department"])
    ) {
        db.serialize(() => {
            var db_students_prepare = db.prepare("INSERT INTO Student_DB (roll_number,name,batch,department) VALUES (?,?,?,?)")

            for (let i = 0; i < data.length; i++) {
                db_students_prepare.run(data[i].rollno.toString(), data[i].name, data[i].batch, data[i].department, (err) => {
                    if (err) {
                        //PASS
                    }
                });
            }
            db_students_prepare.finalize();
            res.send(
                JSON.stringify({
                    message: "Successfully Students Added to Library",
                })
            );

        });
    } else {
        res.send(
            JSON.stringify({
                message: "Check Xlsx File Coloum Name and Order",
            })
        );
    }
};

const UploadFacultys = (req, res) => {
    var workbook = XLSX.read(req.files["file"].data);
    const data = ExtractData(workbook);
    if (
        JSON.stringify(Object.keys(data[0])) ==
        JSON.stringify(["rollno", "name", "department"])
    ) {
        db.serialize(() => {
            var db_facultys_prepare = db.prepare("INSERT INTO Faculty_DB (roll_number,name,department) VALUES (?,?,?)")

            for (let i = 0; i < data.length; i++) {
                values = [];
                db_facultys_prepare.run(data[i].rollno, data[i].name, data[i].department, (err) => {
                    if (err) {
                        //PASS
                    }
                });
            }
            db_facultys_prepare.finalize();
            res.send(
                JSON.stringify({
                    message: "Successfully Facultys Added to Library",
                })
            );
        });
    } else {
        res.send(
            JSON.stringify({
                message: "Check Xlsx File Coloum Name and Order",
            })
        );
    }
};

const UploadBooks = (req, res) => {
    var workbook = XLSX.read(req.files["file"].data);
    const data = ExtractData(workbook);
    var todayTime = new Date();

    var month = todayTime.getMonth() + 1;
    var date = todayTime.getDate();
    var year = todayTime.getFullYear();
    var today_date = year + "-" + month + "-" + date;
    var today_time = todayTime.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    });
    var today = today_date + " " + today_time;
    if (
        JSON.stringify(Object.keys(data[0])) ==
        JSON.stringify([
            "book_id",
            "title",
            "author_type",
            "author",
            "publisher",
        ])
    ) {
        db.serialize(() => {
            var db_books_prepare = db.prepare("INSERT INTO Library_Books (book_id,title,author_type,author,publisher) VALUES (?,?,?,?,?)");
            var db_available_prepare = db.prepare("INSERT INTO Currently_Available (book_id,title,author_type,author,publisher) VALUES (?,?,?,?,?)");

            for (let i = 0; i < data.length; i++) {
                values = [
                    data[i].book_id,
                    data[i].title,
                    data[i].author_type,
                    data[i].author,
                    data[i].publisher,
                ];
                db_books_prepare.run(data[i].book_id, data[i].title, data[i].author_type, data[i].author, data[i].publisher, (err) => {
                    //PASS
                })
                db_available_prepare.run(data[i].book_id, data[i].title, data[i].author_type, data[i].author, data[i].publisher, (err) => {
                    //PASS
                })
            }
            db_books_prepare.finalize();
            db_available_prepare.finalize();
            res.send(
                JSON.stringify({
                    message: "Successfully Books Added to Library",
                })
            );

        });
    } else {
        res.send(
            JSON.stringify({
                message: "Check Xlsx File Coloum Name and Order",
            })
        );
    }
};
module.exports = {
    UploadStudents,
    UploadFacultys,
    UploadBooks,
};