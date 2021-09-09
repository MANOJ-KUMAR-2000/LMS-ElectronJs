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
  db.serialize(() => {
    if (
      JSON.stringify(Object.keys(data[0])) ==
      JSON.stringify(["rollno", "name", "batch", "department"])
    ) {
      for (let i = 0; i < data.length; i++) {
        query = `INSERT INTO Student_DB (roll_number,name,batch,department) VALUES (?,?,?,?);`;
        values = [
          data[i].rollno,
          data[i].name,
          data[i].batch,
          data[i].department,
        ];
        db.run(query, values, (err) => {
          if (err) {
            //PASS
          }
        });
      }
      res.send(
        JSON.stringify({
          message: "Successfully Students Added to Library",
        })
      );
    } else {
      res.send(
        JSON.stringify({
          message: "Check Xlsx File Coloum Name and Order",
        })
      );
    }
  });
};

const UploadFacultys = (req, res) => {
  var workbook = XLSX.read(req.files["file"].data);
  const data = ExtractData(workbook);
  db.serialize(() => {
    if (
      JSON.stringify(Object.keys(data[0])) ==
      JSON.stringify(["rollno", "name", "department"])
    ) {
      for (let i = 0; i < data.length; i++) {
        query = `INSERT INTO Faculty_DB (roll_number,name,department) VALUES (?,?,?);`;
        values = [data[i].rollno, data[i].name, data[i].department];
        db.run(query, values, (err) => {
          if (err) {
            //PASS
          }
        });
      }
      res.send(
        JSON.stringify({
          message: "Successfully Facultys Added to Library",
        })
      );
    } else {
      res.send(
        JSON.stringify({
          message: "Check Xlsx File Coloum Name and Order",
        })
      );
    }
  });
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
  db.serialize(() => {
    db.all("SELECT * FROM Library_Books", (err, books) => {
      result = books.length;
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
        for (let i = 0; i < data.length; i++) {
          result += 1;
          db_query = `INSERT INTO Library_Books (book_id,title,author_type,author,publisher) VALUES (?,?,?,?,?);`;
          available_query = `INSERT INTO Currently_Available (book_id,title,author_type,author,publisher) VALUES (?,?,?,?,?);`;
          values = [
            data[i].book_id,
            data[i].title,
            data[i].author_type,
            data[i].author,
            data[i].publisher,
          ];
          db.run(db_query, values, (err) => {
            //PASS
          });
          db.run(available_query, values, (err) => {
            //PASS
          });
        }
        res.send(
          JSON.stringify({
            message: "Successfully Books Added to Library",
          })
        );
      } else {
        res.send(
          JSON.stringify({
            message: "Check Xlsx File Coloum Name and Order",
          })
        );
      }
    });
  });
};

module.exports = {
  UploadStudents,
  UploadFacultys,
  UploadBooks,
};
