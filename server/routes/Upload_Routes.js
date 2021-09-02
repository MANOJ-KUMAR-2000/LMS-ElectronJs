const express = require("express");
const controller = require("../controllers/Upload_Controller");

const routes = express();

routes.post("/students", controller.UploadStudents);
routes.post("/facultys", controller.UploadFacultys);
routes.post("/books", controller.UploadBooks);

module.exports = routes;
