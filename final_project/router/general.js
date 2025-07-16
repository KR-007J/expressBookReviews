const express = require('express');
const public_users = express.Router();
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

// ✅ Task 6: Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const userExists = users.some((user) => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User successfully registered. Now you can login." });
});

// ✅ Task 10: Get the book list using async/await
public_users.get('/', async (req, res) => {
  try {
    const getBooks = () => {
      return new Promise((resolve) => {
        resolve(books);
      });
    };

    const allBooks = await getBooks();
    return res.status(200).send(JSON.stringify(allBooks, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// ✅ Task 11: Get book by ISBN using async/await
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;

  try {
    const getBookByISBN = () => {
      return new Promise((resolve, reject) => {
        if (books[isbn]) {
          resolve(books[isbn]);
        } else {
          reject("Book not found for the given ISBN");
        }
      });
    };

    const book = await getBookByISBN();
    return res.status(200).json(book);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

// ✅ Task 12: Get books by author using async/await
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author;

  try {
    const getBooksByAuthor = () => {
      return new Promise((resolve, reject) => {
        const results = Object.values(books).filter(book => book.author === author);
        if (results.length > 0) {
          resolve(results);
        } else {
          reject("No books found by the given author");
        }
      });
    };

    const booksByAuthor = await getBooksByAuthor();
    return res.status(200).json(booksByAuthor);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

// ✅ Task 13: Get books by title using async/await
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title;

  try {
    const getBooksByTitle = () => {
      return new Promise((resolve, reject) => {
        const results = Object.values(books).filter(book => book.title === title);
        if (results.length > 0) {
          resolve(results);
        } else {
          reject("No books found with the given title");
        }
      });
    };

    const booksByTitle = await getBooksByTitle();
    return res.status(200).json(booksByTitle);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

// ✅ Task 5: Get book review
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book && book.reviews) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "No reviews found for the given ISBN" });
  }
});

module.exports.general = public_users;
