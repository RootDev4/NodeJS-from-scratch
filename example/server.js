const express = require('express')          // Fast, unopinionated, minimalist web framework for NodeJS
const session = require('express-session')  // Express middleware for working with session-based requests
const cors = require('cors')                // Middleware to enable Cross-Origin Resource Sharing (CORS)
const passport = require('passport')        // Authentication middleware for NodeJS

const app = express()   // Initialize express module
app.use(cors())         // Use cors middleware to enable Cross-Origin Resource Sharing (CORS)
app.use(express.json()) // Middleware to recognize incoming POST/PUT requests as a JSON object
app.use(express.urlencoded({ extended: false })) // Basically parses application/x-www-form-urlencoded requests (string or array objects)

/*
By default, NodeJS searches for files inside the root directory where the server.js file lives.
To set another public accessible directory, use the express.static method. Now any file, which is living inside 
the specified directory, can be accessed from NodeJS and some from a browser.
To keep sensitive files private (like config files etc.), you should not set to many static directories at once.

Example:
- public                    // Static directory
    favicon.ico             // Is directly accessible for NodeJS and browsers (visitors, crawlers)
    manifest.webmanifest    // Is directly accessbile for NodeJS and browsers (visitors, crawlers)
    |_ images               // Files inside are only accessbile for NodeJS
        |_ image1.jpg       // Call with <img src="/images/image1.jpg" title="My image 1">
        |_ image2.jpg       // No /public path is necessary, because NodeJS automatically searches
    |_ assets               // inside all static directories and sub-directories for a given file.
        |_ style.css        // Call with <link rel="stylesheet" href="/assets/style.css">
        |_ app.js           // Call with <script defer src="/assets/app.js"></script>
*/
app.use(express.static(path.join(__dirname, 'public')))

// This will also make the images directory accessbile for browsers.
// Browsers can now request https://yoursite.com/images/image1.jpg
app.use(express.static(path.join(__dirname, 'public/images')))

// User session-based authentication stuff
app.use(session({
    resave: false,              // Forces the (unmodified) session to be saved back to the session store.     
    saveUninitialized: false,   // Forces a session that is "uninitialized" to be saved to the store.
    secret: '<session_secret>', // Secret used to sign the session ID cookie (required option).
    cookie: {                   // Settings object for the session ID cookie.
        maxAge: 60 * 60 * 1000, // Expiration time of cookie in milliseconds (here: 1 hour)
        secure: true            // Send back cookie in a secure way (recommend option, but requires HTTPS)
    }
}))
app.use(passport.initialize())  // Initialize passport middleware
app.use(passport.session())     // Configure passport with session middleware

// Initialize EJS template engine
app.set('views', path.join(__dirname, 'public')) // By default, EJS uses a directory called 'views'
app.set('view engine', 'ejs')

// Run the server on a specified port
const port = 3000
app.listen(port, () => console.log(`Server is up and listening on port ${port}`))