const bcrypt = require("bcryptjs");
const sqlite3 = require("sqlite3").verbose();

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
  query = `SELECT username,password,department,name FROM Librarian_DB WHERE username  = ?`;
  values = [req.body["username"]];

  db.get(query, values, async (err, result) => {
    if (err) {
      console.log(err.message);
    } else {
      if (await bcrypt.compare(req.body["password"], result.password)) {
        res.cookie(
          "nscet",
          {
            username: result.username,
            name: result.name,
            department: result.department,
          },
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
  query = `INSERT INTO Librarian_DB (username,password,name,department) VALUES (?,?,?,?);`;
  values = [
    req.body["username"],
    password,
    req.body["name"],
    req.body["department"],
  ];

  db.run(query, values, (err) => {
    if (err) {
      console.log(err);
      res.send("<h1>Error Unique</h1>");
    } else {
      res.send("<h1>All Clear</h1>");
    }
  });
};

const ForgotPassGet = (req, res) => {
  //res.render("forgot_pass", { error: null });
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
            //res.redirect('/')
          }
        });
      }
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
  ForgotPassGet,
  ForgotPassPost,
  Logout,
};
