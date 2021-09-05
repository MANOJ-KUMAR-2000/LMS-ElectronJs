const express = require("express");
const controller = require("../controllers/Record_Controller");

const routes = express.Router();

routes.get("",(req,res)=>{
    res.render('mainRecords',{username:req.cookies.nscet.username})
})
routes.get("/students", controller.StudentsRecord);
routes.get("/facultys", controller.FacultysRecord);
routes.get("/books", controller.BooksRecord);

routes.post("/student-faculty", controller.SearchFacultyStudent);
routes.post("/book", controller.SearchBook);

module.exports = routes;
