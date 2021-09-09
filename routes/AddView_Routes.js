const express = require("express");
const controller = require("../controllers/AddView_Controller");

const routes = express.Router();

routes.get("/all", controller.All);
routes.get("/backup", controller.backup);
routes.post("/add-student", controller.AddStudents);
routes.post("/add-faculty", controller.AddFacultys);
routes.post("/add-book", controller.AddBooks);

module.exports = routes;