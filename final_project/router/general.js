const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {

  let isbn = req.params.isbn;

  if (isbn >= 0 && isbn<=10){
    let filtered = books[isbn];
    res.send(JSON.stringify(filtered,null,4));
  } else {
    return res.status(500).json({message: "ISBN Not found"});  
  }
  
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  let filtered = [];

  let keys = Object.keys(books);

  keys.forEach(k => {
    if (books[k].author == author){
      filtered.push(books[k]);
    } 
  });

  res.send(JSON.stringify(filtered,null,4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here

  let title = req.params.title;
  let filtered = [];

  let keys = Object.keys(books);

  keys.forEach(k => {
    if (books[k].title == title){
      filtered.push(books[k]);
    } 
  });

  res.send(JSON.stringify(filtered,null,4));

  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here

  let isbn = req.params.isbn;

  if (isbn >= 0 && isbn<=10){
    let filtered = books[isbn].reviews;
    res.send(JSON.stringify(filtered,null,4));
  } else {
    return res.status(500).json({message: "ISBN Not found"});  
  }
});


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});



// TASK 10 - http://localhost:5000/books



public_users.get('/books',function (req, res) {

  const customProm = new Promise((resolve, reject) => {
      resolve(res.send(JSON.stringify({books}, null, 4)));
    });

    customProm.then(() => console.log("Task 10 resolved"));

});

// TASK 11 - http://localhost:5000/books/isbn/

public_users.get('/books/isbn/:isbn',function (req, res) {

  const customProm = new Promise((resolve, reject) => {

      let isbn = req.params.isbn;

      if (isbn >= 0 && isbn<=10){
        let filtered = books[isbn];
        resolve(res.send(JSON.stringify({filtered}, null, 4)));
      } else {
        reject(res.status(500).json({message: "ISBN Not found"}));  
      }
    });

    customProm.then(() => console.log("Task 11 resolved"));

});

// TASK 12 - http://localhost:5000/books/author/

public_users.get('/books/author/:author',function (req, res) {

  let author = req.params.author;
  let filtered = [];

  const customProm = new Promise((resolve, reject) => {

      let keys = Object.keys(books);

      keys.forEach(k => {
        if (books[k].author == author){
          filtered.push(books[k]);
        } 
      });

      resolve(res.send(JSON.stringify({filtered}, null, 4)));
    });

    customProm.then(() => console.log("Task 12 resolved"));

});


// TASK 13 - http://localhost:5000/books/title

public_users.get('/books/title/:title',function (req, res) {

  const customProm = new Promise((resolve, reject) => {

    let title = req.params.title;
    let filtered = [];
  
    let keys = Object.keys(books);
  
    keys.forEach(k => {
      if (books[k].title == title){
        filtered.push(books[k]);
      } 
    });

      resolve(res.send(JSON.stringify({filtered}, null, 4)));
    });

    customProm.then(() => console.log("Task 13 resolved"));

});

module.exports.general = public_users;
