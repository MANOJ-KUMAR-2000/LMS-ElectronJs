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
    `SELECT * FROM Book_Issued WHERE role  = Student`,
    (err, student_issued) => {
      if (err) {
        res.send("Something Went Wrong");
      } else {
        res.send(student_issued);
        //res.render("###", { student_issueds: student_issued });
      }
    }
  );
};

const FacultysRecord = (req, res) => {
  db.all(
    `SELECT * FROM Book_Issued WHERE role  = Student`,
    (err, faculty_issued) => {
      if (err) {
        res.send("Something Went Wrong");
      } else {
        res.send(faculty_issued);
        //res.render("###", { faculty_issueds: faculty_issued });
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
      //res.render("###", { available_books: available_book });
    }
  });
};

const SearchStudent = (req, res) => {};

const SearchFaculty = (req, res) => {};

const SearchBook = (req, res) => {
  if (req.body["search_key"] == undefined) {
    query_id = `SELECT * FROM Currently_Available WHERE book_id = ?`;
    value_id = [req.body["search_id"]];
    db.get(query, value, (err, book_result) => {
      if (err) {
        res.send("Something Went Wrong");
      } else {
        res.send(book_result);
      }
    });
  } else {
    query_key = `SELECT * FROM Currently_Available WHERE title LIKE = ?;`;
    value_key = ["%" + req.body["search_key"] + "%"];
    console.log(value_key);
    db.all(query_key, value_key, (err, match_books) => {
      if (err) {
        res.send("SomeThing Went Wrong");
      } else {
        res.send(match_books);
      }
    });
  }
};

module.exports = {
  StudentsRecord,
  FacultysRecord,
  BooksRecord,
  SearchStudent,
  SearchFaculty,
  SearchBook,
};
