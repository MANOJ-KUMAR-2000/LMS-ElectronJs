const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database/Master_DB.db", (err) => {
  if (err) {
    return console.error(err.message);
  } else {
    console.log("IssueReturn Database Connected");
  }
});

const IssueBook = (req, res) => {
  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

  var date_time = date + " " + time;

  var validation_date = new Date(Date.now() + 12096e5);
  validation_date = validation_date.toLocaleDateString() + " " + time;
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
                  value = [
                    req.body["role"],
                    req.body["book_ids"][i],
                    date_time,
                    validation_date,
                    req.body["roll_number"],
                    book_titles.title,
                  ];
                  add_query = `INSERT INTO Book_Issued (role,book_id,date,validation_date,roll_number,book_title) VALUES (?,?,?,?,?,?);`;
                  remove_query = `DELETE FROM Currently_Available WHERE book_id = ?`;
                  db.run(add_query, value);
                  db.run(remove_query, req.body["book_ids"][i]);
                }
                res.send("All Clear");
              } else {
                console.log("bookid mismatch");
              }
            }
          );
        } else {
          res.send("ID not found");
        }
      }
    );
  });
};

const ShowReturnBook = (req, res) => {
  db.all(
    `SELECT * FROM Book_Issued WHERE roll_number = ?`,
    [req.body["roll_number"]],
    (err, result) => {
      if (result.length == 0) {
        console.log("No Books Issued");
      } else {
        res.send(result);
      }
    }
  );
};

const ReturnBook = (req, res) => {};

module.exports = { IssueBook, ShowReturnBook, ReturnBook };
