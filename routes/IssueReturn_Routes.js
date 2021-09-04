const express = require("express");
const controller = require("../controllers/IssueReturn_Controller");

const routes = express.Router();

routes.post("/issue", controller.IssueBook);
routes.post("/return", controller.ReturnBook);

module.exports = routes;
