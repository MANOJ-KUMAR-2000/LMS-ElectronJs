const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database/Master_DB.db", (err) => {
  if (err) {
    return console.error(err.message);
  } else {
    //console.log("IssueReturn Database Connected");
  }
});

const IssueReturnGet = (req, res) => {
  res.render("issueReturn", { username: req.cookies.nscet.username });
};

const IssueBook = (req, res) => {
  var todayTime = new Date();

  var month = todayTime.getMonth() + 1;
  var today_date = todayTime.getDate();
  var vali_date = todayTime.getDate() + 14;
  var year = todayTime.getFullYear();

  var date = year + "-" + month + "-" + today_date;
  var untill_date = year + "-" + month + "-" + vali_date;
  var time = todayTime.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  date_time = date + " | " + time;

  validation_date = untill_date + " | " + time;

  db.serialize(() => {
    var value = "";
    for (let i = 0; i < req.body["book_ids"].length; i++) {
      value += "'" + req.body["book_ids"][i] + "',";
    }
    value = value.slice(0, -1);
    db.get(
      `SELECT * FROM ` + req.body["role_search"] + ` WHERE roll_number = ?`,
      [req.body["roll_number"]],
      (err, result) => {
        if (result != undefined || result != null) {
          db.all(
            `SELECT * FROM Currently_Available WHERE book_id IN (` +
              value +
              `)`,
            (err, book_titles) => {
              if (book_titles.length == req.body["book_ids"].length) {
                for (let i = 0; i < req.body["book_ids"].length; i++) {
                  if (req.body["role_search"] == "Student_DB") {
                    value = [
                      req.body["role"],
                      req.body["book_ids"][i],
                      date,
                      validation_date,
                      req.body["roll_number"],
                      book_titles[i].title,
                      result.department,
                      result.batch,
                      result.name,
                    ];
                  } else {
                    value = [
                      req.body["role"],
                      req.body["book_ids"][i],
                      date,
                      validation_date,
                      req.body["roll_number"],
                      book_titles[i].title,
                      result.department,
                      "NULL",
                      result.name,
                    ];
                  }
                  add_query = `INSERT INTO Book_Issued (role,book_id,date,validation_date,roll_number,book_title,department,batch,name) VALUES (?,?,?,?,?,?,?,?,?);`;
                  remove_query = `DELETE FROM Currently_Available WHERE book_id = ?`;
                  db.run(add_query, value);
                  db.run(remove_query, req.body["book_ids"][i]);
                }
                res.send(
                  JSON.stringify({
                    message:
                      "Book Successfully Issued to RollNumber : " +
                      req.body["roll_number"],
                  })
                );
              } else {
                res.send(
                  JSON.stringify({
                    message: "Currently One of the Book is Not Available",
                  })
                );
              }
            }
          );
        } else {
          res.send(
            JSON.stringify({
              message: "RollNumber is Invalid",
            })
          );
        }
      }
    );
  });
};

const ShowIssuedCheck = (req, res) => {
  db.get(
    `SELECT * FROM ` + req.body["roll_search"] + ` WHERE roll_number = ?;`,
    [req.body["roll_number"]],
    (err, detail_result) => {
      if (detail_result == undefined) {
        res.send(
          JSON.stringify({
            message: "Roll Number " + req.body["roll_number"] + " Not Found",
          })
        );
      } else {
        db.all(
          `SELECT * FROM Book_Issued WHERE roll_number = ?`,
          [req.body["roll_number"]],
          (err, issued_result) => {
            if (issued_result.length == 0) {
              res.send(
                JSON.stringify({
                  message:
                    "No Book Issued to Roll Number : " +
                    req.body["roll_number"],
                  roll_detail: detail_result,
                  issue_detail: [],
                })
              );
            } else {
              res.send(
                JSON.stringify({
                  roll_detail: detail_result,
                  issued_detail: issued_result,
                })
              );
            }
          }
        );
      }
    }
  );
};

const ShowReturnCheck = (req, res) => {
  db.get(
    `SELECT * FROM ` + req.body["roll_search"] + ` WHERE roll_number = ?;`,
    [req.body["roll_number"]],
    (err, detail_result) => {
      if (detail_result == undefined) {
        res.send(
          JSON.stringify({
            message: "Roll Number " + req.body["roll_number"] + " Not Found",
          })
        );
      } else {
        db.all(
          `SELECT * FROM Book_Issued WHERE roll_number = ? AND role = ?`,
          [req.body["roll_number"], req.body["role"]],
          (err, return_result) => {
            if (return_result.length == 0) {
              res.send(
                JSON.stringify({
                  message:
                    "No Book Issued to Roll Number : " +
                    req.body["roll_number"],
                  roll_detail: detail_result,
                  return_detail: [],
                })
              );
            } else {
              res.send(
                JSON.stringify({
                  roll_detail: detail_result,
                  return_detail: return_result,
                })
              );
            }
          }
        );
      }
    }
  );
};

const ReturnBook = (req, res) => {
  get_from_db_query = `SELECT * FROM Library_Books WHERE book_id = ?`;
  issue_detail_query = `SELECT * FROM Book_Issued WHERE book_id = ?`;
  remove_from_issued_query = `DELETE FROM Book_Issued WHERE book_id = ?`;
  insert_available_query = `INSERT INTO Currently_Available (book_id,title,author_type,author,publisher) VALUES (?,?,?,?,?);`;

  for (let i = 0; i < req.body["return_books"].length; i++) {
    db.get(
      issue_detail_query,
      [req.body["return_books"][i]],
      (err, issue_book_detail) => {
        db.get(
          get_from_db_query,
          [req.body["return_books"][i]],
          (err, book) => {
            insert_available_value = [
              book.book_id,
              book.title,
              book.author_type,
              book.author,
              book.publisher,
            ];
            db.run(insert_available_query, insert_available_value, (err) => {
              full_report_insert_query = `INSERT INTO FullReport (roll_number,role,book_id,validation_date,is_delayed,book_title,department,batch,issued_date,return_date) VALUES (?,?,?,?,?,?,?,?,?,?)`;
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
              var today = today_date;
              var is_delayed = "";
              issued_info_date =
                issue_book_detail.validation_date.split(" ")[0];

              to_compare_validation_date = issued_info_date.split("-");
              to_compare_returning_date = today_date.split("-");
              if (
                parseInt(to_compare_validation_date[0]) >=
                parseInt(to_compare_returning_date[0])
              ) {
                if (
                  parseInt(to_compare_validation_date[1]) >=
                  parseInt(to_compare_returning_date[1])
                ) {
                  if (
                    parseInt(to_compare_validation_date[2]) >=
                    parseInt(to_compare_returning_date[2])
                  ) {
                    is_delayed = "On Time";
                  } else {
                    is_delayed = "Delayed";
                  }
                } else {
                  is_delayed = "Delayed";
                }
              } else {
                is_delayed = "Delayed";
              }
              full_value = [
                issue_book_detail.roll_number,
                issue_book_detail.role,
                issue_book_detail.book_id,
                issue_book_detail.validation_date,
                is_delayed,
                issue_book_detail.book_title,
                issue_book_detail.department,
                issue_book_detail.batch,
                issue_book_detail.date,
                today,
              ];
              db.run(full_report_insert_query, full_value, (err) => {
                db.run(remove_from_issued_query, [req.body["return_books"][i]]);
              });
            });
          }
        );
      }
    );
  }
  res.send(
    JSON.stringify({
      message:
        "Book ID : " +
        req.body["return_books"] +
        " Book Successfully Returned By " +
        req.body["return_roll_number"],
    })
  );
};

module.exports = {
  IssueReturnGet,
  IssueBook,
  ShowIssuedCheck,
  ReturnBook,
  ShowReturnCheck,
};
