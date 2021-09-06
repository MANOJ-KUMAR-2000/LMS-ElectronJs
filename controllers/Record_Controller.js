const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database/Master_DB.db", (err) => {
    if (err) {
        return console.error(err.message);
    } else {
        console.log("Record Database Connected");
    }
});

const WhoHasWhatGet = (req, res) => {
    res.render('whohaswhatRec', { students: [], match_books: [], roll_detail: [], message: null, username: req.cookies.nscet.username })
}

const StudentsRecord = (req, res) => {
    db.all(
        `SELECT * FROM Book_Issued WHERE role = 'Student'`,
        (err, student_issued) => {
            if (student_issued.length == 0) {
                res.send(
                    JSON.stringify({
                        message: "No Book Issued to Students"
                    })
                );
            } else {
                res.render('studentsRecords', { students: student_issued, username: req.cookies.nscet.username });
            }
        }
    );
};

const FacultysRecord = (req, res) => {
    db.all(
        `SELECT * FROM Book_Issued WHERE role = 'Faculty'`,
        (err, faculty_issued) => {
            if (faculty_issued.length == 0) {
                res.send(
                    JSON.stringify({
                        message: "No Book Issued to Facultys"
                    })
                );
            } else {
                res.render('facultyRecords', { facultys: faculty_issued, username: req.cookies.nscet.username });
            }
        }
    );
};

const BooksRecord = (req, res) => {
    db.all(`SELECT * FROM Currently_Available`, (err, available_book) => {
        if (available_book.length == 0) {
            res.send(
                JSON.stringify({
                    message: "No Book Currently Available"
                })
            );
        } else {
            res.render('booksRecord', { books: available_book, username: req.cookies.nscet.username });
        }
    });
};

const SearchbyKey = (req, res) => {
    query_key = `SELECT * FROM Book_Issued WHERE book_title LIKE ?`;
    value_key = "%" + req.body["search_key"] + "%";
    db.all(query_key, value_key, (err, match_books) => {
        if (match_books.length == 0) {
            res.render('whohaswhatRec', { match_books: [], roll_detail: [], message: "No Book Found To Keyword : " + req.body["search_key"] })
        } else {
            if (match_books[0].role == 'Faculty') {
                db.get(`SELECT * FROM Faculty_DB WHERE roll_number = ?`, [match_books[0].roll_number], (err, roll_number_detail) => {
                    res.render('whohaswhatRec', { username: req.cookies.nscet.username, match_books: match_books, roll_detail: roll_number_detail, message: null })
                })
            } else {
                db.get(`SELECT * FROM Student_DB WHERE roll_number = ?`, [match_books[0].roll_number], (err, roll_number_detail) => {
                    res.render('whohaswhatRec', { username: req.cookies.nscet.username, match_books: match_books, roll_detail: roll_number_detail, message: null })
                })
            }
        }
    });
}


const SearchFaculty = (req, res) => {
    query_id = `SELECT * FROM Book_Issued WHERE roll_number = ?`;
    value_id = [req.body["search_roll_number"]];
    db.all(query_id, value_id, (err, result) => {
        if (result.length == 0) {
            res.render('facultyRecords', { facultys: [], username: req.cookies.nscet.username });
        } else {
            res.render('facultyRecords', { facultys: result, username: req.cookies.nscet.username });
        }
    });
}


const SearchStudent = (req, res) => {
    query_id = `SELECT * FROM Book_Issued WHERE roll_number = ?`;
    value_id = [req.body["search_roll_number"]];
    db.all(query_id, value_id, (err, result) => {
        if (result.length == 0) {
            res.render('studentsRecords', { students: [], username: req.cookies.nscet.username });
        } else {
            res.render('studentsRecords', { students: result, username: req.cookies.nscet.username });
        }
    });
};

const SearchBook = (req, res) => {
    query_id = `SELECT * FROM Currently_Available WHERE author_type LIKE ? AND author LIKE ? AND title LIKE ? AND publisher LIKE ?`;
    value_id = [
        "%" + req.body["author_type"] + "%",
        "%" + req.body["author"] + "%",
        "%" + req.body["title"] + "%",
        "%" + req.body["publisher"] + "%",
    ];
    db.all(query_id, value_id, (err, book_result) => {

        if (book_result.length == 0) {
            res.render('booksRecord', { books: [], username: req.cookies.nscet.username });
        } else {
            res.render('booksRecord', { books: book_result, username: req.cookies.nscet.username });
        }

    });
};

module.exports = {
    StudentsRecord,
    FacultysRecord,
    BooksRecord,
    SearchFaculty,
    SearchStudent,
    SearchbyKey,
    SearchBook,
    WhoHasWhatGet,
};