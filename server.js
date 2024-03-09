/*********************************************************************************
*  WEB700 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Samuel Adekola Student ID 130895220______ Date: _3/9/2024__
*
*  Online (Cycliic) Link: ________________________________________________________
*
********************************************************************************/ 


var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require("body-parser"); // Added for parsing request bodies
var collegeData = require("./modules/collegeData.js");

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));

collegeData.initialize().then(() => {
    console.log("Data initialized. Setting up the routes.");

    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.static(path.join(__dirname, 'views')));

    app.get("/", (req, res) => {
        res.sendFile(path.join(__dirname, 'views', 'home.html'));
    });

    app.get("/students", (req, res) => {
        if (req.query.course) {
            collegeData.getStudentsByCourse(req.query.course)
                .then((students) => res.json(students))
                .catch(() => res.json({message: "no results"}));
        } else {
            collegeData.getAllStudents()
                .then((students) => res.json(students))
                .catch(() => res.json({message: "no results"}));
        }
    });

    app.get("/tas", (req, res) => {
        collegeData.getTAs()
            .then((tas) => res.json(tas))
            .catch(() => res.json({message: "no results"}));
    });

    app.get("/courses", (req, res) => {
        collegeData.getCourses()
            .then((courses) => res.json(courses))
            .catch(() => res.json({message: "no results"}));
    });

    app.get("/student/:num", (req, res) => {
        const studentNum = req.params.num;
        collegeData.getStudentByNum(studentNum)
            .then((student) => res.json(student))
            .catch(() => res.json({message: "no results"}));
    });

    app.get("/about", (req, res) => {
        res.sendFile(path.join(__dirname, 'views', 'about.html'));
    });

    app.get("/htmlDemo", (req, res) => {
        res.sendFile(path.join(__dirname, 'views', 'htmlDemo.html'));
    });

    // Route for serving addStudent.html for adding a new student
    app.get("/students/add", (req, res) => {
        res.sendFile(path.join(__dirname, 'views', 'addStudent.html'));
    });

    // Route for handling POST requests to add a new student
    app.post("/students/add", (req, res) => {
        collegeData.addStudent(req.body)
            .then(() => {
                res.redirect("/students");
            })
            .catch((err) => {
                console.error("Failed to add student:", err);
                res.status(500).send("Failed to add student");
            });
    });

    app.use((req, res) => {
        res.status(404).send("Page Not Found");
    });

    app.listen(HTTP_PORT, () => {
        console.log("Server listening on port: " + HTTP_PORT);
    });

}).catch(err => {
    console.error("Failed to initialize data:", err);
});
