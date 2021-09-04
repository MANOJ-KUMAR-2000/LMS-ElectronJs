const express = require("express");
const controller = require("../controllers/AddView_Controller");

const routes = express.Router();

routes.get("/", controller.AddView)

routes.get("/view-students", controller.ViewStudents);
routes.get("/view-facultys", controller.ViewFacultys);
routes.get("/view-books", controller.ViewBooks);

routes.post("/add-student", controller.AddStudents);
routes.post("/add-faculty", controller.AddFacultys);
routes.post("/add-book", controller.AddBooks);

module.exports = routes;