const mongoose = require('mongoose')    // MongoDB object modeling tool designed to work in an asynchronous environment.
const Schema = mongoose.Schema          // Models are defined through the Schema interface.

// Define a new schema for `users` collection.
// Schema interface takes a JSON object with settings for each field.
const userSchema = new Schema({
    email: { type: String, required: true, unique: true },  // This is a reference to the user, who created this project
    password: { type: String, required: true },             // The title of this project
}, { timestamps: true })                                    // This automatically adds createdAt and updatedAt fields to this collection

// Export schema with functional identifier `User`
module.exports = mongoose.model('User', userSchema)