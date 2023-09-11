const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

/*You will now ensure that all operations restricted to auhtenticated customers are intercepted by the middleware. 
The following code ensures that all the endpoints starting with /customer/auth/ go through the middleware. 
It retrieves the authorization details from the session and verifies it. 
If the token is validated, the user is aunteticated and the control is passed on to the next endpoint handler. 
If the token is invalid, the user is not authenticated and an error message is returned.*/

app.use("/customer/auth/*", function auth(req,res,next){
    if(req.session.authorization) {
        token = req.session.authorization['accessToken'];
        jwt.verify(token, "access",(err,user)=>{
            if(!err){
                req.user = user;
                next();
            }
            else{
                return res.status(403).json({message: "User not authenticated"})
            }
         });
     } else {
         return res.status(403).json({message: "User not logged in"})
     }
 });
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);


app.listen(PORT,()=>console.log("Server is running"));
