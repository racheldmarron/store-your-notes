const express = require("express");
const path = require("path");
const fs = require("fs"); 
const util = require("util"); 
// const { allowedNodeEnvironmentFlags } = require("process");
// const { createBrotliDecompress } = require("zlib");
// const data = require('./db/db.json'); 
// const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8')); 

const app = express(); 
const PORT = process.env.PORT || 3001; 

// var createId = () => {
//     return 'id-' + Math.random().toString(36).substring(2, 16);
//   };

app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 

app.use(express.static(path.join(__dirname, './public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html')); 
}); 

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html')); 
}); 

app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'db/db.json')); 
}); 

app.get("/api/notes/:note", function(req, res) {
    var selectNote = req.params.note;
    console.log(selectNote);
    return res.json(selectNote) 
    }); 

app.post("api/notes", (req, res) => {
    const addNote = req.body; 
    addNote.id = Date.now(); 
    let noteData = fs.readFileSync('./db/db.json'); 
    let noteTaker = JSON.parse(noteData); 

    noteTaker.push(req.body);

    fs.writeFileSync('./db/db.json', JSON.stringify(noteTaker), (err, data) => {
        if (err) throw err;
        res.json(noteTaker)
    }); 

    res.sendFile(path.join(__dirname, './public/notes.hmtl'));
}); 

app.delete("/api/notes/:id", (req, res) => {
    let noteData = fs.readFileSync('./db/db.json');
    let noteTaker = JSON.parse(noteData); 

    const noteSave = noteTaker.find(n.id === parseInt(req.params.id)); 

    const noteIndex = noteTaker.indexOf(noteSave); 
    noteTaker.splice(noteIndex); 

    fs.writeFile(__dirname + "./db/db.json", JSON.stringify(noteTaker), (err, data) => {
        if (err) throw err; 
        res.json(noteTaker) 
    });
}); 

app.get("/notes", (req, res) => 
    res.sendFile(__dirname + "./public/notes.html")); 

app.getMaxListeners("*", (req, res) =>
    res.sendFile(__dirname + "./public/index.html")); 

app.listen(PORT, () => {
    console.log(`App is listening at port ${PORT}`); 
}); 

