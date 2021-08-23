const express = require("express")
const app = express()
const mongoose = require("mongoose")
const allRoutes = require("./routes/index")
const session = require('express-session')
const dotenv = require("dotenv")
dotenv.config()

const URL = process.env.DATABASE_URL
const LocalDB = 'mongodb://localhost/NodeUsers'
mongoose.connect(URL, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
.then(()=>console.log("connected to db!"))
.catch((err)=>console.log(err));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: false}))
app.use(express.json());
app.use(session(
    { secret: 'secret',
     cookie: { maxAge: 60000 },
     resave: false,
     saveUninitialized: false,
     name:"my-session"
    }))

app.use("/", allRoutes)
app.listen(process.env.PORT || 3000, ()=>console.log("Server is Running..."))


// 1. Implement Sign Up:
// 	- collect email and password from the user and create a user in the database
// 	- Before inserting, check if the user already exists in the database or not.
// 	- On sign up, redirect the user for the sign-in route.
// 2. Implement Sign In:
// 	- Check if the user is available in the database or not, if not, redirect the user to sign up
// 	- If the user is available, verify the password and redirect him to his home on the successful sign in
// 	- else display a message saying, 'Please verify credentials provided'
// 3. Create a session
// 	- Using express-session, on a successful sign-in, add email and role (can be either ADMIN or GUEST) to req. session object
// 4. Add the following middlewares:
// 	- For '/home' route, check if a user is signed in or not (Check for req.session.email).
// 	- For '/admin' route, check if user has a role of ADMIN or not (Check for req.session.role === 'ADMIN').
