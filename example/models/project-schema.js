const mongoose = require('mongoose')    // MongoDB object modeling tool designed to work in an asynchronous environment.
const Schema = mongoose.Schema          // Models are defined through the Schema interface.

// Define a new schema for `projects` collection.
// Schema interface takes a JSON object with settings for each field.
const projectSchema = new Schema({
    userId: { type: String, required: true },   // This is a reference to the user, who created this project
    title: { type: String, required: true },    // The title of this project
    content: { type: String, trim: true }       // The content of this project
}, { timestamps: true })                        // This automatically adds createdAt and updatedAt fields to this collection

// Export schema with functional identifier `Project`
module.exports = mongoose.model('Project', userSchema)