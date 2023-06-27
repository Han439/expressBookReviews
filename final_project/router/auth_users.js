const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    //write code to check is the username is valid
    let validUser = users.filter((user) => {
        return user.username === username
    });

    if(validUser.length > 0) {
        return false;
    } else {
        return true;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    //write code to check if username and password match the one we have in records.
    const authenticatedUser = users.filter((user) => {
        return (user.username === username && user.password === password)
    })

    if (authenticatedUser.length > 0) {
        return true
    } else {
        return false
    }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in." })
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
  
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successully logged in!")
    } else {
        return res.status(208).json({ message: 'Invalid Login. Check username and password again!'})
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  const username = req.session.authorization['username']
  const review = req.query.review;

  book.review[username] = review;

  return res.send('Your review is added!');
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn;
    const book = books[isbn];
    const username = req.session.authorization['username']
  
    delete book.review[username];
  
    return res.send('Your review is added!');
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
