// PASSPORT-CONFIG.JS

const LocalStrategy = require('passport-local').Strategy    // Local strategy to verify email and password credentials
const User = require('./models/user-schema')                // Import user schema (database)
const crypto = require('crypto')                            // Provides cryptographic functionality

// Authentication middleware to check, if an user is logged in
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next()
    res.redirect('/login')
}

// Authentication middleware to check, if an user is NOT logged in
function isNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return res.redirect('/dashboard')
    next()
}

// Get an user object by email adress
async function getUserByEmail(email) {
    const user = await User.findOne({ email: email })
    return user
}

// Get an user object by ID
async function getUserById(id) {
    const user = await User.findById(id)
    return user
}

// Initialize passport strategy
function authenticate(passport) {

    // Build a new passport strategy for authenticating with a username and password
    passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, async (email, password, done) => {

        // Check if an user with given email address exists
        const user = await getUserByEmail(email)
        if (user == null) {
            return done(null, false, { type: 'error', message: 'No user with that email address found.' })
        }

        // Check if passwords match
        const hashedPass = crypto.createHash('sha256').update(password).digest('hex')
        if (hashedPass !== user.password) {
            return done(null, false, { type: 'error', message: 'You\'ve entered a wrong password.' })
        }

        // User authentication was successful
        return done(null, user)
    }))

    // On the first user authentication, the user object is serialized and stored in the session
    passport.serializeUser((user, done) => done(null, user.id))

    // Deserializing the user and populates req.user object on each following request
    passport.deserializeUser(async (id, done) => done(null, await getUserById(id)))

}

// Export functions to the importing script (routes.js in this case)
module.exports = { isAuthenticated, isNotAuthenticated, authenticate }