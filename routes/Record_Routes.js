const express = require("express");
const controller = require("../controllers/Record_Controller");

const routes = express.Router();

routes.get("", (req, res) => {
  res.render("mainRecords", { username: req.cookies.nscet.username });
});
routes.get("/students", controller.StudentsRecord);
routes.get("/facultys", controller.FacultysRecord);
routes.get("/books", controller.BooksRecord);
routes.get("/who-has-what", controller.WhoHasWhatGet);

routes.post("/students", controller.SearchStudent);
routes.post("/facultys", controller.SearchFaculty);
routes.post("/books", controller.SearchBook);
routes.post("/who-has-what", controller.SearchbyKey);

module.exports = routes;
