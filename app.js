// app.js
const express = require('express');
const bodyParser = require('body-parser');

require('dotenv').config();
const connection = require('./connection');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/bookmarks', (req,res)=> {
  res.status(200).send({
    message: "Hello World!"
  });
});


app.get('/bookmarks/:bookmarkId', (req, res) => {
  connection.query('SELECT * FROM bookmark where id=?', req.params.bookmarkId, (error, result) => {
      if(result.length===0) return res.status(404).send({ error: 'Bookmark not found' });
      return res.status(200).send(result[0]);
  });
});


app.post('/bookmarks', (req, res)=> {
  const url = req.body.url;
  const title = req.body.title;
  if(!url || !title){
    res.status(422).send({
      error: "required field(s) missing"
    })
  }
  connection.query('INSERT INTO bookmark SET ?', req.body, (err, stats) => {
    if (err)
      return res.status(500).json({ error: err.message, sql: err.sql });

    connection.query('SELECT * FROM bookmark WHERE id = ?', stats.insertId, (err, records) => {
      if (err)
        return res.status(500).json({ error: err.message, sql: err.sql });
      return res.status(201).json(records[0]);
    });
  });

});

module.exports = app;
