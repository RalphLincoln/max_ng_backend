const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const fetch = require('node-fetch');
const morgan = require('morgan');

const port = 5000;

// Initializing App
const app = express();
app.use(morgan('combined'));

// Creating Connection to MySql Database
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "starwars",
});

// db.connect((err) => {
//     if (err) {
//         throw err;
//     }
//     console.log('Connected to database');
// });




app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/starwars/film', async (req, res, next) => {
    // API CALL TO GET DATA FROM SWAPI
    const api_url = "https://swapi.dev/api/films/";
    const fetch_response = await fetch(api_url);
    const json = await fetch_response.json();
    const char = await json.results

    // GETTING ALL TITLES
    const titles = await char.map(data => {
        return (
            console.log(data.title),
            {
                title: data.title,
                description: data.opening_crawl,
                actors: data.characters
            }
        )
    })
    res.json({
        data1: titles,
        full: json,
    });
})

// GETTING LIST OF COMMENTS
app.get('/comments', (req, res, next) => {
    var sql = "SELECT * FROM comments";
    db.query(sql, (err, rows, fields) => {
        if (err) throw err;
        res.statusCode(201).json({ data: rows });
    })
})


// POSTING COMMENTS
app.post('/comments', (req, res, next) => {
    var sql = `INSERT INTO comments (name, comments) VALUES (${req.body.name}, ${req.body.comments}`;
    db.query(sql, (err, rows, fields) => {
        if (err) throw err;
        res.statusCode(201).json({ data: "Record Inserted" });
    });
})


app.set('port', process.env.port || port);


app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});