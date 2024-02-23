const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let filtered_users = users.filter(user => {
    user.usename == username
  })
  if (filtered_users.length > 0) {
    return true
  }
  return false
}

const authenticatedUser = (username, password) => {
  let filtered_users = users.filter(user => {
    return (user.username === username && user.password === password)
  })
  if (filtered_users.length > 0) {
    return true
  }
  return false
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  let username = req.body.username
  let password = req.body.password

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'fingerprint_customer', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn
  books[isbn]['reviews'][req.user] = req.body.review
  console.log(books[isbn])
  res.send("Review added")
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn
  delete books[isbn]['reviews'][req.user]
  console.log(books[isbn])
  res.send("Review deleted")
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
