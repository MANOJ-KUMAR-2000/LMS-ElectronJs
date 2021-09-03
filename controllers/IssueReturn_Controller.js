const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database/Master_DB.db", (err) => {
  if (err) {
    return console.error(err.message);
  } else {
    console.log("IssueReturn Database Connected");
  }
});

module.exports = {};
