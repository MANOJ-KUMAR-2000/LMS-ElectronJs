const express = require("express");
const controller = require("../controllers/Record_Controller");

const routes = express.Router();

routes.get("/students", controller.StudentsRecord);
routes.get("/facultys", controller.FacultysRecord);
routes.get("/books", controller.BooksRecord);

routes.post("/student", controller.SearchStudent);
routes.post("/faculty", controller.SearchFaculty);
routes.post("/book", controller.SearchBook);

module.exports = routes;
