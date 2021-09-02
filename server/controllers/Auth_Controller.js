const bcrypt = require("bcryptjs");
const sqlite3 = require("sqlite3").verbose();
const jwt = require("jsonwebtoken");

const db = new sqlite3.Database("./database/Master_DB.db", (err) => {
  if (err) {
    return console.error(err.message);
  } else {
    console.log("Authentication Database Connected");
  }
});

const LoginGet = (req, res) => {
  //res.render("login", { error: null });
};

const RegisterGet = (req, res) => {
  //res.render("register", { error: null });
};

const LoginPost = (req, res) => {
  query = `SELECT username,password,name FROM Librarian_DB WHERE username  = ?`;
  values = [req.body["username"]];

  db.get(query, values, async (err, result) => {
    if (err) {
      console.log(err.message);
    } else {
      if (await bcrypt.compare(req.body["password"], result.password)) {
        res.cookie(
          "nscet",
          { username: result.username, name: result.name },
          { httpOnly: true }
        );
        res.send("<h1>Logged In</h1>");
      } else {
        res.send("<h1>Wrong Password</h1>");
      }
    }
  });
};

const RegisterPost = async (req, res) => {
  const password = await bcrypt.hash(req.body["password"], 12);
  query = `INSERT INTO Librarian_DB (username,password,name) VALUES (?,?,?);`;
  values = [req.body["username"], password, req.body["name"]];

  db.run(query, values, (err) => {
    if (err) {
      res.send("<h1>Error Unique</h1>");
    } else {
      res.send("<h1>All Clear</h1>");
    }
  });
};

const Logout = (req, res) => {
  res.clearCookie("nscet");
  res.redirect("/");
};

module.exports = {
  LoginGet,
  LoginPost,
  RegisterGet,
  RegisterPost,
  Logout,
};
