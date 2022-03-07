const express = require("express");
const path = require("path");
const fs = require("fs"); 
const { allowedNodeEnvironmentFlags } = require("process");
const { createBrotliDecompress } = require("zlib");
// const util = require("util"); 
const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8')); 

let app = express(); 
let PORT = process.env.PORT || 3001; 

app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 

app.use(express.static("./public"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html")); 
}); 

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html")); 
}); 

app.get("/api/notes", (req, res) => {
    console.log(notes);
    return res.json(notes); 
    }); 

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html")); 
}); 

app.post("api/notes", (req, res) => {
    let addNote = req.body; 
    addNote = createId(); 
    notes.push(addNote); 
    fs.writeFileSync("./db/db.json", JSON.stringify(notes)); 
    res.json(notes); 
})

app.delete("/api/notes/:id", (req, res) => {
    let deleteNote = req.params.id; 

    for (let i = 0; i < notes.length; i++) {
        if (deleteNote === notes[i].id) {
            notes.splice(i,1);
            fs.writeFileSync("./db/db.json", JSON.stringify(notes));
            return res.json(notes); 
        }
    }
    return res.json(false); 
})

app.listen(PORT, () => {
    console.log(`App is listening at port ${PORT}`); 
}); 

