const express = require("express");

const routes = express.Router();

routes.get("/home", (req, res) => {
    console.log(req.cookies.nscet.department)
    if(req.cookies.nscet.department == 'CSE'){
        res.render("home",{username:req.cookies.nscet.username,dept_name:"Computer Science & Engineering"});
    }
    if(req.cookies.nscet.department == 'EEE'){
        res.render("home",{username:req.cookies.nscet.username,dept_name:"Electrical and Electronics Engineering"});
    }
    if(req.cookies.nscet.department == 'ECE'){
        res.render("home",{username:req.cookies.nscet.username,dept_name:"Electronics & Communication Engineering"});
    }
    if(req.cookies.nscet.department == 'MECH'){
        res.render("home",{username:req.cookies.nscet.username,dept_name:"Mechanical Engineering"});
    }
    if(req.cookies.nscet.department == 'CIVIL'){
        res.render("home",{username:req.cookies.nscet.username,dept_name:"Civil Engineering"});
    }
});

module.exports = routes;