// ROUTES.JS

const passport = require('passport')            // Authentication middleware for NodeJS.
const crypto = require('crypto')                // Provides cryptographic functionality
const User = require('./models/user-schema')    // Import user schema

// Exports all code, that is inside this module.exports function. You can now access
// all stuff inside the importing file, in your case server.js
// 'app' and `passport` are coming from require('./routes')(app, passport) <-- called inside your server.js file. 
module.exports = (app, passport) => {

    // Import passport configuration to authenticate users
    const { isAuthenticated, isNotAuthenticated, authenticate } = require('./passport-config')

    // Initialize passport strategy
    authenticate(passport)

    // Route for site index
    // Browser HTTP request: http://localhost:3000/
    // app.get takes as first argument the requesting path, 
    // second argument(s) are optional middleware function(s); in this case a function to check, if an user is logged in or not
    // and the last argument is a callback, containing the HTTP request (req) and response (res) variables.
    app.get('/', isAuthenticated, (req, res) => {
        res.redirect('/dashboard')  // If an user is logged in, he's getting redirected to the dashboard
    })

    // Route for user registration.
    // Browser HTTP request: http://localhost:3000/register
    app.get('/register', isNotAuthenticated, (req, res) => {
        if (req.isAuthenticated()) {
            res.redirect('/dashboard')      // If user is already logged in, redirect to dashboard
        } else {
            res.render('views/register')    // Otherwise, render registration form
        }
    })

    // Registration route for posted user credentials.
    // Because we're using `await` inside this function, we have to make it asynchronous.
    app.post('/register', isNotAuthenticated, async (req, res, next) => {
        try {
            const email = req.body.email        // req.body.email contains the value of the input field named `email` 
            const password = req.body.password  // Same as email, but for the password input field
            const repPass = req.body.repPass    // Same as email, but for the repeated password input field

            // Create a SHA256 hashed password by using the built-in crypto module
            const hashedPass = crypto.createHash('sha256').update(password).digest('hex')

            // Check of both passwords matches.
            // If not, set an error message and redirect user to the register page
            if (password !== repPass) {
                req.flash('error', 'Passwords do not match')    // Set flash message
                return res.redirect('/register')                // Redirect user to the registration page
            }

            // Check if desired email address is already registered and stored in the database.
            // `await` means, that the script will wait for the result.
            const emails = await User.find({ email: email }, error => console.log(error))

            // If an entry with desired email address was found, return an error
            if (emails.length) {
                req.flash('error', 'This email address is already registered.')
                return res.redirect('/register')
            }

            // If everything is ok, store the user into the database
            await new User({ email: email, password: hashedPass }).save(error => {

                // Check for errors and return them
                if (error) {
                    req.flash('error', error.errmsg)
                    return res.redirect('/register')
                }

                // If no errors occured, the registration was successful
                req.flash('success', 'Your registration was successful. Please sign in now.')
                return res.redirect('/login')
            })
        } catch (exception) {
            console.log(exception) // Print exception message
            return res.redirect('/register')
        }
    })

    // Route for user login
    // Browser HTTP request: http://localhost:3000/login
    app.get('/login', isNotAuthenticated, (req, res) => {
        if (req.isAuthenticated()) {
            res.redirect('/dashboard') // If user is still logged in, redirect to dashboard
        } else {
            res.render('views/login') // Otherwise, render registration form
        }
    })

    app.post('/login', isNotAuthenticated, passport.authenticate('local', {
        successRedirect: '/dashboard',  // Redirection route, if user login was successful
        failureRedirect: '/login',      // Redirection route, if user login failed
        failureFlash: true              // Use flash to show error messages to the user
    }))

    // Route for user logout
    // Browser HTTP request: http://localhost:3000/logout
    app.get('/logout', isAuthenticated, (req, res) => {
        req.logout()
        req.flash('success', 'You\'ve been successfully logged out.')
        res.redirect('/login')
    })

    // Route for dashboard (only for logged in users)
    // Browser HTTP request: http://localhost:3000/dashboard
    app.get('/dashboard', isAuthenticated, (req, res) => {
        res.render('views/dashboard', { username: req.user })
    })

}