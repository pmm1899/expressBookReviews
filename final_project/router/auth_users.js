const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {

    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60});
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

  // Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here

  const isbn = req.params.isbn;
  const review = req.body.review;
  let exist = false;

    if (isbn >= 0 && isbn<=10){

      let keys = Object.keys(books);
      

      keys.forEach(k => {
        if (k == isbn){

            let reviews = Object.values(books[k].reviews);

            let size = reviews.length;

            reviews.forEach(currentReview=>{
              if (currentReview.user == req.session.authorization.username){
                exist = true;
                currentReview.text = review;
                res.status(200).json({message: "User: " +req.session.authorization.username + " has edited his review on isbn: " + isbn});
              }
           });


           //res.status(200).json({message: books[isbn].reviews});

           if (!exist){

              let newReview = {
                "user": req.session.authorization.username,
                "text":review,
              }
    
            books[isbn].reviews[size+1] = newReview;

            res.status(200).json({message: "User: " +req.session.authorization.username + " has created a new review on isbn : " +isbn});
           } 
        } 
      });
    }

    return res.status(300).json({message: "Yet to be implemented"});
});


regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
    let keysReviews = [];
    let toDelete = -1;


    const isbn = req.params.isbn;
    if (isbn >= 0 && isbn<=10){

      let keys = Object.keys(books);
      

      keys.forEach(k => {
        if (k == isbn){

            let reviews = Object.keys(books[isbn].reviews);

            reviews.forEach(index=>{

              if (books[isbn].reviews[index].user == req.session.authorization.username){
                toDelete = index;  
                return;
              }
              
           });

           if (toDelete > -1){
              delete (books[isbn].reviews[toDelete]);

              res.status(200).json({message: "Review from user: " +req.session.authorization.username + "has been deleted on book isbn: " + isbn});
          } else 
            res.status(200).json({message: "User: " +req.session.authorization.username + " does not have any reviews yet"});
        } 
      });

      
    }

    return res.status(300).json({message: "OK"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
