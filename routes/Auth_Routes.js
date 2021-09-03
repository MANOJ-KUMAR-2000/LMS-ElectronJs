const express = require("express");
const controller = require("../controllers/Auth_Controller");

const routes = express.Router();

routes.get("/register", controller.RegisterGet);
routes.get("/login", controller.LoginGet);
routes.get("/forgot-pass", controller.ForgotPassGet);

routes.post("/register", controller.RegisterPost);
routes.post("/login", controller.LoginPost);
routes.post("/forgot-pass", controller.ForgotPassPost);

routes.get("/logout", controller.Logout);

module.exports = routes;
