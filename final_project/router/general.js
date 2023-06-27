const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
      if (isValid(username)) {
          users.push({ "username": username, "password": password })
          return res.status(200).json({ message: `User ${username} registered successfully! Now you can log in.` })
      }

      return res.status(404).json({ message: `User ${username} already exists!`})
  } else {
      return res.status(404).json({ message: 'Unable to register user.' })
  }
});

function getBooks() {
    return new Promise((resolve, reject) => {
        if (books) {
            setTimeout(() => {
                resolve(books)
            }, 2000)
        } else {
            const error = new Error('Unable to retrieve books from database');
            reject(error);
        }
    });
}

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  getBooks()
    .then((booksList) => {
      res.send(JSON.stringify(booksList, null, 4));
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
});

function getBookByIsbn(isbn) {
    return new Promise((resolve, reject) => {
        if (books && books[isbn]) {
            setTimeout(() => {
                const book = books[isbn]
                resolve(book)
            }, 2000)
        } else {
            const error = new Error(
                `There is no book matches the isbn ${isbn} from the database`
            );
            reject(error);
        }
    });
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    try {
        const book = await getBookByIsbn(isbn);
        res.json(book);
      } catch (error) {
        res.status(404).send(error.message);
      }
});

function getBooksByAuthor(author) {
    return new Promise((resolve, reject) => {
        if (books && author) {
            setTimeout(() => {
                const booksByAuthor = Object.values(books).filter(book => {
                    return book.author === author
                })
                resolve(booksByAuthor)
            }, 2000)
        } else {
            const error = new Error(
                `There is no book from the author ${author} from the database`
            );
            reject(error);
        }
    });
}
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    //Write your code here
    const author = req.params.author;
    try {
        const booksByAuthor = await getBooksByAuthor(author);
        res.json(booksByAuthor);
      } catch (error) {
        res.status(404).send(error.message);
      }
});

function getBookByTitle(title) {
    return new Promise((resolve, reject) => {
        if (books && title) {
            setTimeout(() => {
                const bookByTitle = Object.values(books).filter(book => {
                    return book.title === title
                })
                resolve(bookByTitle)
            }, 2000)
        } else {
            const error = new Error(
                `There is no book name ${title} from the database`
            );
            reject(error);
        }
    });
}

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
  const title = req.params.title;
    try {
        const bookByTitle = await getBookByTitle(title);
        res.json(bookByTitle);
      } catch (error) {
        res.status(404).send(error.message);
      }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  return res.send(books[isbn].reviews);
});

module.exports.general = public_users;
