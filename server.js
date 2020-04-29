//Dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");
var db = require("./db/db.json");
var uniqid = require("uniqid");

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
app.get("/api/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./db/db.json"))
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
    var newNotes = req.body;
    newNotes["id"] = uniqid();
    fs.readFile("./db/db.json", "utf8", function(err, data) {
        if (err) throw err;
        var notesJson = JSON.parse(data);
        notesJson.push(newNotes);
        fs.writeFileSync("./db/db.json", JSON.stringify(notesJson), err => {
            if (err) throw err;
        });
    });
});

//Should receive a query parameter containing the id of a note to delete
app.delete("/api/notes/:id", function(req, res) {
    fs.readFile("./db/db.json", "utf8", function(err, data) {
        var deletedNote = req.params.id;
        var notesJson = JSON.parse(data);
        notesJson = notesJson.filter(savedNotes => {
            return savedNotes.id !== deletedNote;
        })
        fs.writeFile("./db/db.json", JSON.stringify(notesJson), "utf8", function (err) {
            if (err) throw err;
            res.json(notesJson);
        });      
    });
});

//Start the server to begin listening
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});
