//Dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");
var db = require("./db/db.json");

//Sets up Express
const app = express();
const PORT = process.env.PORT || 3000;

//Sets up Express to handle data parsing
app.use(express.urlencoded({ extended:true }));
app.use(express.json());
app.use(express.static(__dirname + '/public'));
//Routes
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});
app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

//Should read the `db.json` file and return all saved notes as JSON
app.get("/api/notes", function(req, res) {
    fs.readFileSync("./db/db.json", function(err) {
        if (err) {
            throw err;
        };
    })
});

//Start the server to begin listening
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});