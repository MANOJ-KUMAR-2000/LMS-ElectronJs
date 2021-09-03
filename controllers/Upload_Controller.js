const sqlite3 = require("sqlite3").verbose();
const XLSX = require("xlsx");
var json2xls = require("json2xls");
const fs = require("fs");

const db = new sqlite3.Database("./database/Master_DB.db", (err) => {
  if (err) {
    return console.error(err.message);
  } else {
    console.log("Upload Database Connected");
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
  var workbook = XLSX.read(req.files[""].data);
  const data = ExtractData(workbook);
  db.serialize(() => {
    if (
      JSON.stringify(Object.keys(data[0])) ==
      JSON.stringify(["roll_number", "name", "batch", "department"])
    ) {
      for (let i = 0; i < data.length; i++) {
        query = `INSERT INTO Student_DB (roll_number,name,batch,department) VALUES (?,?,?,?);`;
        values = [
          data[i].rollno,
          data[i].name,
          data[i].batch,
          data[i].department,
        ];
        db.run(query, values);
      }
      res.send("<h1>All Clear</h1>");
    } else {
      res.send("Check Xlsx File");
    }
  });
};

const UploadFacultys = (req, res) => {
  var workbook = XLSX.read(req.files[""].data);
  const data = ExtractData(workbook);
  db.serialize(() => {
    if (
      JSON.stringify(Object.keys(data[0])) ==
      JSON.stringify(["rool_number", "name", "department"])
    ) {
      for (let i = 0; i < data.length; i++) {
        query = `INSERT INTO Faculty_DB (roll_number,name,department) VALUES (?,?,?);`;
        values = [data[i].rollno, data[i].name, data[i].department];
        db.run(query, values);
      }
      res.send("<h1>All Clear</h1>");
    } else {
      res.send("Check Xlsx File");
    }
  });
};

const UploadBooks = (req, res) => {
  var workbook = XLSX.read(req.files[""].data);
  const data = ExtractData(workbook);
  db.serialize(() => {
    db.all("SELECT * FROM Library_Books", async (err, books) => {
      result = books.length;
      if (
        JSON.stringify(Object.keys(data[0])) ==
        JSON.stringify(["title", "author_type", "author", "publisher"])
      ) {
        for (let i = 0; i < data.length; i++) {
          result += 1;
          book_id = req.cookies.nscet.department + result;
          db_query = `INSERT INTO Library_Books (book_id,title,author_type,author,publisher) VALUES (?,?,?,?,?);`;
          available_query = `INSERT INTO Currently_Available (book_id,title,author_type,author,publisher) VALUES (?,?,?,?,?);`;
          values = [
            book_id,
            data[i].title,
            data[i].author_type,
            data[i].author,
            data[i].publisher,
          ];
          data[i].book_id = book_id;
          db.run(db_query, values);
          db.run(available_query, values);
        }
        var xls = json2xls(data);
        fs.writeFileSync("data.xlsx", xls, "binary");
        res.send("<h1>All Clear</h1>");
      } else {
        res.send("Check Xlsx File");
      }
    });
  });
};

module.exports = {
  UploadStudents,
  UploadFacultys,
  UploadBooks,
};