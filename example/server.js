const express = require('express')              // Fast, unopinionated, minimalist web framework for NodeJS.
const session = require('express-session')      // Express middleware for working with session-based requests.
const flash = require('express-flash')          // Display message and render it without redirecting the request.
const cors = require('cors')                    // Middleware to enable Cross-Origin Resource Sharing (CORS).
const passport = require('passport')            // Authentication middleware for NodeJS.
const path = require('path')                    // Provides utilities for working with file and directory paths.
const mongoose = require('mongoose')            // MongoDB object modeling tool designed to work in an asynchronous environment.
const app = express()                           // Initialize express module

/*
By default, NodeJS searches for files inside the root directory where the server.js file lives. This directory 
isn't public by default...and never should be!
To set another public accessible directory, use the express.static method. Now any file, which is living inside 
the specified directory, can be accessed from NodeJS and from browsers (page visitors) and crawlers (Google etc)!
To keep sensitive files private (like config files etc.), have a closer look of where you have stored such files.

Example:
- public                    // Static directory, all files are public and hence accessible for everybody
    favicon.ico             // Get file by requesting http://localhost:3000/favicon.ico
    manifest.webmanifest
    |_ images
        |_ image1.jpg       // Include with <img src="/images/image1.jpg" title="My image 1">
        |_ image2.jpg       // No /public prefix is necessary, because NodeJS automatically searches
    |_ assets               // inside all static directories and sub-directories for a given file.
        |_ style.css        // Include with <link rel="stylesheet" href="/assets/style.css">
        |_ app.js           // Include with <script defer src="/assets/app.js"></script>
*/
app.use(express.static(path.join(__dirname, 'public'))) // `public` is always a good name for this directory

// User session-based authentication stuff
app.use(session({               // Initialize express session middleware
    resave: false,              // Forces the (unmodified) session to be saved back to the session store.     
    saveUninitialized: false,   // Forces a session that is "uninitialized" to be saved to the store.
    secret: '<session_secret>', // Secret used to sign the session ID cookie (required option).
    cookie: {                   // Settings object for the session ID cookie.
        maxAge: 60 * 60 * 1000, // Expiration time of cookie in milliseconds (here: 1 hour)
        //secure: true          // Send back cookie in a secure way (recommend option, but requires HTTPS)
    }
}))
app.use(passport.initialize())  // Initialize passport middleware
app.use(passport.session())     // Configure passport with session middleware
app.use(flash())                // Display a message to user after HTTP request
app.use(cors())                 // Use cors middleware to enable Cross-Origin Resource Sharing (CORS)
app.use(express.urlencoded({    // Middleware to recognize incoming POST/PUT requests as string or array objects
    extended: true              // Allows to post nested JSON objects like { person: { name: 'jon' } }
}))

// Initialize EJS template engine
app.set('views', path.join(__dirname, 'public')) // By default, EJS uses a directory called `views`. You can change that here.
app.set('view engine', 'ejs')

// Initialize MongoDB with `mongoose` wrapper and connect to database
mongoose.connect('mongodb://localhost:27017/nodefromscratch', {
    useNewUrlParser: true,      // Activates the new url parser to parse MongoDB connection string
    useUnifiedTopology: true,   // Removes support for several connection options that are no longer relevant with the new topology engine
    useCreateIndex: true        // Connection will use createIndex() instead of ensureIndex() for automatic index builds via Model.init()
})
mongoose.connection.on('error', () => console.log('Connection to database failed'))     // Print errors
mongoose.connection.once('open', () => console.log('Database successfully connected'))  // Print message, if successfully connected to database

// Include routes to handle GET and POST requests
require('./routes')(app, passport) // Send app and passport variable to the required script file and use it there

// Run the server on a specified port
// Caution: you'll need sudo rights on Linux, if you choose a port lower than 1024
const port = 3000
app.listen(port, () => console.log(`Server is up and listening on port ${port}`))