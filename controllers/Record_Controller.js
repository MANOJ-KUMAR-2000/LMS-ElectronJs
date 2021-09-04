const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database/Master_DB.db", (err) => {
  if (err) {
    return console.error(err.message);
  } else {
    console.log("Record Database Connected");
  }
});

const StudentsRecord = (req, res) => {
  db.all(
    `SELECT * FROM Book_Issued WHERE role = 'Student'`,
    (err, student_issued) => {
      if (err) {
        res.send("Something Went Wrong");
      } else {
        res.send(student_issued);
      }
    }
  );
};

const FacultysRecord = (req, res) => {
  db.all(
    `SELECT * FROM Book_Issued WHERE role = 'Faculty'`,
    (err, faculty_issued) => {
      if (err) {
        console.log(err);
        res.send("Something Went Wrong");
      } else {
        res.send(faculty_issued);
      }
    }
  );
};

const BooksRecord = (req, res) => {
  db.all(`SELECT * FROM Currently_Available`, (err, available_book) => {
    if (err) {
      res.send("Something Went Wrong");
    } else {
      res.send(available_book);
    }
  });
};

const SearchFacultyStudent = (req, res) => {
  if (req.body["search_key"] == undefined) {
    query_id = `SELECT * FROM Book_Issued WHERE roll_number = ?`;
    value_id = [req.body["search_roll_number"]];
    db.all(query_id, value_id, (err, result) => {
      if (err) {
        res.send("Something Went Wrong");
      } else {
        if (book_result == undefined) {
          res.send("no id found");
        } else {
          res.send(result);
        }
      }
    });
  } else {
    query_key = `SELECT * FROM Book_Issued WHERE book_title LIKE ?`;
    value_key = "%" + req.body["search_key"] + "%";
    db.all(query_key, value_key, (err, match_books) => {
      if (err) {
        res.send("SomeThing Went Wrong");
      } else {
        if (match_books.length == 0) {
          res.send("no such found");
        } else {
          res.send(match_books);
        }
      }
    });
  }
};

const SearchBook = (req, res) => {
  if (req.body["search_key"] == undefined) {
    query_id = `SELECT * FROM Currently_Available WHERE author_type LIKE ? AND author LIKE ? AND title LIKE ? AND publisher LIKE ?`;
    value_id = [
      "%" + req.body["author_type"] + "%",
      "%" + req.body["author"] + "%",
      "%" + req.body["title"] + "%",
      "%" + req.body["publisher"] + "%",
    ];
    db.all(query_id, value_id, (err, book_result) => {
      if (err) {
        res.send("Something Went Wrong");
      } else {
        if (book_result.lenght === 0) {
          res.send("no Book found");
        } else {
          res.send(book_result);
        }
      }
    });
  } else {
    query_key = `SELECT * FROM Currently_Available WHERE title LIKE ?`;
    value_key = "%" + req.body["search_key"] + "%";
    db.all(query_key, value_key, (err, match_books) => {
      if (err) {
        res.send("SomeThing Went Wrong");
      } else {
        if (match_books.length == 0) {
          res.send("no such book found");
        } else {
          res.send(match_books);
        }
      }
    });
  }
};

module.exports = {
  StudentsRecord,
  FacultysRecord,
  BooksRecord,
  SearchFacultyStudent,
  SearchBook,
};
