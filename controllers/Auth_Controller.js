const bcrypt = require("bcryptjs");
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database/Master_DB.db", (err) => {
  if (err) {
    return console.error(err.message);
  } else {
    //console.log("Authentication Database Connected");
  }
});

const LoginGet = (req, res) => {
  db.all(`SELECT username FROM Librarian_DB`, (err, result) => {
    res.render("login", { users: result, error: null });
  });
};

const RegisterGet = (req, res) => {
  res.render("register", { error: null });
};

const ForgotPassGet = (req, res) => {
  db.all(`SELECT username FROM Librarian_DB`, (err, result) => {
    res.render("forgotpass", { users: result, error: null });
  });
};

const LoginPost = (req, res) => {
  query = `SELECT username,password,department FROM Librarian_DB WHERE username  = ?`;
  values = [req.body["username"]];

  db.get(query, values, async (err, result) => {
    if (err) {
      console.log(err);
    } else {
      if (
        result &&
        (await bcrypt.compare(req.body["password"], result.password))
      ) {
        res.cookie(
          "nscet",
          {
            username: result.username,
            department: result.department,
          },
          { httpOnly: true }
        );
        res.redirect("/home");
      } else {
        db.all(`SELECT username FROM Librarian_DB`, (err, result) => {
          res.render("login", { users: result, error: "Invalid Password!" });
        });
      }
    }
  });
};

const RegisterPost = async (req, res) => {
  const password = await bcrypt.hash(req.body["password"], 12);

  query = `INSERT INTO Librarian_DB (username,password,department) VALUES (?,?,?);`;
  values = [req.body["username"], password, req.body["department"]];
  check_username = req.body["username"].split(" ");
  if (check_username.length > 1) {
    res.render("register", {
      error: "Username Only Contain Letters and Numbers not Spaces",
    });
  } else {
    db.run(query, values, (err) => {
      if (err) {
        err_msg = "Error !";
        if (err.errno === 19) {
          err_msg = "Username exists !";
        }
        res.render("register", { error: err_msg });
      } else {
        res.redirect("/authentication/login");
      }
    });
  }
};

const ForgotPassPost = (req, res) => {
  db.get("SELECT * FROM App_Security", async (err, result) => {
    if (err) {
      console.log(err);
    } else {
      if (result.app_key == req.body["app_key"]) {
        const new_password = await bcrypt.hash(req.body["new_password"], 12);
        query = `UPDATE Librarian_DB SET password = ? WHERE username = ?`;
        values = [new_password, req.body["username"]];
        db.run(query, values, function (err) {
          if (err) {
            console.log(err);
          } else {
            res.redirect("/authentication/login");
          }
        });
      } else {
        db.all(`SELECT username FROM Librarian_DB`, (err, result) => {
          res.render("forgotpass", {
            users: result,
            error: "Invalid secirity key",
          });
        });
      }
    }
  });
};

const Logout = (req, res) => {
  res.clearCookie("nscet");
  res.redirect("/authentication/login");
};

module.exports = {
  LoginGet,
  LoginPost,
  RegisterGet,
  RegisterPost,
  ForgotPassGet,
  ForgotPassPost,
  Logout,
};
