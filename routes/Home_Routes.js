const express = require("express");

const routes = express.Router();

routes.get("/home", (req, res) => {
    if (req.cookies.nscet.department == 'CSE') {
        res.render("home", { username: req.cookies.nscet.username, dept_name: "Computer Science & Engineering" });
    }
    if (req.cookies.nscet.department == 'EEE') {
        res.render("home", { username: req.cookies.nscet.username, dept_name: "Electrical & Electronics Engineering" });
    }
    if (req.cookies.nscet.department == 'ECE') {
        res.render("home", { username: req.cookies.nscet.username, dept_name: "Electronics & Communication Engineering" });
    }
    if (req.cookies.nscet.department == 'MECH') {
        res.render("home", { username: req.cookies.nscet.username, dept_name: "Mechanical Engineering" });
    }
    if (req.cookies.nscet.department == 'CIVIL') {
        res.render("home", { username: req.cookies.nscet.username, dept_name: "Civil Engineering" });
    }
});

module.exports = routes;