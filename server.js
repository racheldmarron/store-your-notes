const express = require("express");
const path = require("path");
const fs = require("fs"); 

const app = express(); 
const PORT = process.env.PORT || 3001; 

// let notesData = []; 

app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 
app.use(express.static("public")); 
// app.use(express.static(path.join(__dirname, './public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html")); 
}); 

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, "public/notes.html")); 
}); 

app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'db/db.json')); 
}); 

app.post("/api/notes", (req, res) => {
    fs.readFile(path.join(__dirname, "db.json"), "utf8", function(error, response) {
        if (error) {
            console.log(error);
        }
        const notes = JSON.parse(response);
        const noteAdd = req.body;
        const newNoteID = notes.length + 1;
        const newNote = {
            id: newNoteID,
            title: noteAdd.title,
            text: noteAdd.text
        };
        notes.push(newNote);
        res.json(newNote);
        fs.writeFile(path.join(__dirname, "db.json"), JSON.stringify(notes, null, 2), function(err) {
            if (err) throw err;
        });
    });
});

app.delete("/api/notes/:id", (req, res) => {
    const deleteNote = req.params.id;
    fs.readFile("db.json", "utf8", function(error, response) {
        if (error) {
            console.log(error);
        }
        let notes = JSON.parse(response);
        if(deleteNote <= notes.length) {
            res.json(notes.splice(deleteID-1,1));
            for (let i = 0; i < notes.length; i++) {
                notes[i].id = i+1;
            }
            fs.writeFile("db.json", JSON.stringify(notes, null, 2), function(err) {
                if (err) throw err;
            });
        }else {
            res.json(false);
        }
    });
});

app.listen(PORT, () => {
    console.log(`App is listening at port ${PORT}`); 
}); 