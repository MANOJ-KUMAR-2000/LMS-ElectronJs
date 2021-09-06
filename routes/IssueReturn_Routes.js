const express = require("express");
const controller = require("../controllers/IssueReturn_Controller");

const routes = express.Router();

routes.get("/", controller.IssueReturnGet);

routes.post("/issue", controller.IssueBook);
routes.post("/return", controller.ReturnBook);

routes.post("/check-return", controller.ShowReturnCheck);
routes.post("/check-issued", controller.ShowIssuedCheck);

module.exports = routes;
