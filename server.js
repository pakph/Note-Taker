//Dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");
var db = require("./db/db.json");

var notes = []

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
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

//Should read the `db.json` file and return all saved notes as JSON
app.get("/api/notes", function(req, res) {
    fs.readFile("./db/db.json", "utf8", (err, data) => {
        if (err) {
            throw err;
        }
        return res.json(data);
    });
});

//Should receive a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client
app.post("/api/notes", function(req, res) {
    var newNote = req.body;
    notes.push(newNote);
    var notesJson = JSON.stringify(notes);
    fs.writeFile("./db/db.json", notesJson, "utf8", err => {
        if (err) throw err;
        fs.readFile("./db/db.json", "utf8",  function (err,data) {
            if (err) throw err;
            notes = JSON.parse(data);
            notes.push(newNote);
            fs.writeFile("./db/db.json", notesJson, "utf8", function (err) {
                if (err) throw err;
            });
        });
    });
});

//Should receive a query parameter containing the id of a note to delete


//Start the server to begin listening
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});