const express = require("express");
const controller = require("../controllers/Auth_Controller");

const routes = express();

routes.get("/register", controller.RegisterGet);
routes.get("/login", controller.LoginGet);

routes.post("/register", controller.RegisterPost);
routes.post("/login", controller.LoginPost);

routes.get("/logout", controller.Logout);

module.exports = routes;
