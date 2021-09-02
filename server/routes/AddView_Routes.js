const express = require("express");
const controller = require("../controllers/AddView_Controller");

const routes = express();

routes.get("/view-students", controller.ViewStudents);
routes.get("/view-facultys", controller.ViewFacultys);
routes.get("/view-books", controller.ViewBooks);

routes.post("/add-students", controller.AddStudents);
routes.post("/add-facultys", controller.AddFacultys);
routes.post("/add-books", controller.AddBooks);

module.exports = routes;
