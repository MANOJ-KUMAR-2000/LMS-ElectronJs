const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database/Master_DB.db", (err) => {
  if (err) {
    return console.error(err.message);
  } else {
    console.log("AddView Database Connected");
  }
});

const ViewStudents = (req, res) => {
  query = `SELECT * FROM Student_DB;`;
  db.all(query, (err, result) => {
    if (err) {
      res.send("<h1>Error on Fetch</h1>");
    } else {
      res.send(result);
    }
  });
};

const ViewFacultys = (req, res) => {
  query = `SELECT * FROM Faculty_DB;`;
  db.all(query, (err, result) => {
    if (err) {
      res.send("<h1>Error on Fetch</h1>");
    } else {
      res.send(result);
    }
  });
};

const ViewBooks = (req, res) => {
  query = `SELECT * FROM Library_Books;`;
  db.all(query, (err, result) => {
    if (err) {
      res.send("<h1>Error on Fetch</h1>");
    } else {
      res.send(result);
    }
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
      res.send("<h1>Error Unique</h1>");
    } else {
      res.send("<h1>All Clear</h1>");
    }
  });
};

const AddFacultys = (req, res) => {
  query = `INSERT INTO Faculty_DB (roll_number,name,department) VALUES (?,?,?);`;
  values = [req.body["roll_number"], req.body["name"], req.body["department"]];
  db.run(query, values, (err) => {
    if (err) {
      res.send("<h1>Error Unique</h1>");
    } else {
      res.send("<h1>All Clear</h1>");
    }
  });
};

const AddBooks = (req, res) => {
  db.all(`SELECT * FROM Library_Books`, async (err, result) => {
    book_id = req.cookies.nscet.department + (result.length + 1);

    db_query = `INSERT INTO Library_Books (book_id,title,author_type,author,publisher) VALUES (?,?,?,?,?);`;
    available_query = `INSERT INTO Currently_Available (book_id,title,author_type,author,publisher) VALUES (?,?,?,?,?);`;
    values = [
      book_id,
      req.body["title"],
      req.body["author_type"],
      req.body["author"],
      req.body["publisher"],
    ];
    db.run(db_query, values, (err) => {
      if (err) {
        console.log(err);
        res.send("<h1>Error Unique</h1>");
      } else {
        db.run(available_query, values, (err) => {
          if (err) {
            console.log(err);
            res.send("<h1>Error Unique</h1>");
          } else {
            res.send("All Clear");
          }
        });
      }
    });
  });
};

module.exports = {
  ViewStudents,
  ViewFacultys,
  ViewBooks,
  AddStudents,
  AddFacultys,
  AddBooks,
};