const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  if (isValid(req.body.username)) {
    res.status(400).send("User already exists")
  } else {
    users.push({ "username": req.body.username, "password": req.body.password })
    res.send("User added")
  }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  let booksPromise = new Promise((resolve) => {
    setTimeout(() => { resolve(books) }, 1000)
  })
  booksPromise.then(data => {
    res.send(JSON.stringify(data))
  })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  let booksPromise = new Promise((resolve) => {
    setTimeout(() => { resolve(books[req.params.isbn]) }, 1000)
  })
  booksPromise.then(data => {
    res.send(JSON.stringify(data))
  })
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  let booksPromise = new Promise((resolve) => {
    setTimeout(() => {
      let author = req.params.author
      let result = []
      for (key of Object.keys(books)) {
        if (books[key]['author'] == author) {
          result.push(books[key])
        }
      }
      resolve(result)
    }, 1000)
  })
  booksPromise.then(data => {
    res.send(JSON.stringify(data))
  })
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  let booksPromise = new Promise((resolve) => {
    setTimeout(() => {
      let title = req.params.title
      let result = []
      for (key of Object.keys(books)) {
        if (books[key]['title'] == title) {
          result.push(books[key])
        }
      }
      resolve(result)
    }, 1000)
  })
  booksPromise.then(data => {
    res.send(JSON.stringify(data))
  })
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  let booksPromise = new Promise((resolve) => {
    setTimeout(() => { resolve(books[req.params.isbn]['reviews']) }, 1000)
  })
  booksPromise.then(data => {
    res.send(JSON.stringify(data))
  })
});

module.exports.general = public_users;
