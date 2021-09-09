const sqlite3 = require("sqlite3").verbose();
const FormData = require("form-data");
const fs = require("fs");
var http = require("http");

const db = new sqlite3.Database("./database/Master_DB.db", (err) => {
  if (err) {
    return console.error(err.message);
  } else {
    //console.log("AddView Database Connected");
  }
});

const All = (req, res) => {
  db.all(`SELECT * FROM Student_DB ORDER BY name`, (err, studnets) => {
    db.all(`SELECT * FROM Faculty_DB ORDER BY name`, (err, facultys) => {
      db.all(`SELECT * FROM Library_Books ORDER BY title`, (err, books) => {
        res.render("database", {
          username: req.cookies.nscet.username,
          students_db: studnets,
          facultys_db: facultys,
          books_db: books,
          backup: null,
        });
      });
    });
  });
};

const AddStudents = (req, res) => {
  query = `INSERT INTO Student_DB (roll_number,name,batch,department) VALUES (?,?,?,?);`;
  values = [
    req.body["roll_number"],
    req.body["name"],
    req.body["batch"],
    req.body["department"],
  ];
  db.run(query, values, (err) => {
    if (err) {
      res.send(
        JSON.stringify({
          message: "Student RollNumber Already Exist",
        })
      );
    } else {
      res.send(
        JSON.stringify({
          message: "Student Added Succesfully",
        })
      );
    }
  });
};

const AddFacultys = (req, res) => {
  query = `INSERT INTO Faculty_DB (roll_number,name,department) VALUES (?,?,?);`;
  values = [req.body["roll_number"], req.body["name"], req.body["department"]];
  db.run(query, values, (err) => {
    if (err) {
      res.send(
        JSON.stringify({
          message: "Faculty RollNumber Already Exist",
        })
      );
    } else {
      res.send(
        JSON.stringify({
          message: "Faculty Added Successfully",
        })
      );
    }
  });
};

const AddBooks = (req, res) => {
  db.all(`SELECT * FROM Library_Books`, (err, result) => {
    book_id = req.cookies.nscet.department + (result.length + 1);

    db_query = `INSERT INTO Library_Books (book_id,title,author_type,author,publisher) VALUES (?,?,?,?,?);`;
    available_query = `INSERT INTO Currently_Available (book_id,title,author_type,author,publisher) VALUES (?,?,?,?,?);`;
    values = [
      req.body["book_id"],
      req.body["title"],
      req.body["author_type"],
      req.body["author"],
      req.body["publisher"],
    ];
    db.run(db_query, values, (err) => {
      if (err) {
        res.send(
          JSON.stringify({
            message: "Book ID ALready Exist",
          })
        );
      } else {
        db.run(available_query, values, (err) => {
          if (err) {
            console.log(err);
          } else {
            res.send(
              JSON.stringify({
                message: "Book Sucessfully Added",
              })
            );
          }
        });
      }
    });
  });
};

function backup(req, res) {
  data = new FormData();

  data.append("dept", req.cookies.nscet.department);
  data.append("dept_DB_file", fs.createReadStream("database/Master_DB.db"));
  data.submit("https://nscet.org/deptLMS_BackUP/BackupRestore.php");

  db.all(`SELECT * FROM Student_DB ORDER BY name`, (err, studnets) => {
    db.all(`SELECT * FROM Faculty_DB ORDER BY name`, (err, facultys) => {
      db.all(`SELECT * FROM Library_Books ORDER BY title`, (err, books) => {
        res.render("database", {
          username: req.cookies.nscet.username,
          students_db: studnets,
          facultys_db: facultys,
          books_db: books,
          backup: "Backup was sucessful !",
        });
      });
    });
  });
}

module.exports = {
  backup,
  AddStudents,
  AddFacultys,
  AddBooks,
  All,
};
