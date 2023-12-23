/**
 * DEPENDENCIES
 */
require('dotenv').config() // this is how we make use of our .evnv variables
require("./config/db") // bring in our db config
const express = require('express')
const morgan = require('morgan') // logger... spills the tea
const methodOverride = require("method-override")

const app = express()
const {PORT = 3013 } = process.env;
// const PORT = process.env.PORT || 3013

// Bring in our model
const Book = require("./models/Book.js")

/**
 * MIDDLEWARE
 */

app.use(morgan("dev")) // logging
app.use(express.urlencoded({extended: true})) // body parser this is how we get access to req.body
app.use(methodOverride("_method")) // Lets us use DELETE PUT HTTP verbs 

/**
 * ROUTES & ROUTER
 * INDUCES
 */

// Index - GET render all of the books
app.get("/books", async (req, res) => {
    // find all of the books in Mongo
    let books = await Book.find({})
    // render all of the books => index.ejs
    res.render("index.ejs", {
        books: books.reverse()
    })

})

// New - GET for the form to create a new book
app.get("/books/new", (req, res) => {
    // res.send("new book")
    res.render("new.ejs")
})

// DELETE
app.delete("/books/:id", async (req, res) => {
    try {
        // Find a book and then delete
        let deletedBook = await Book.findByIdAndDelete(req.params.id)
        console.log(deletedBook)
        // redirect back to the index
        res.redirect("/books")
        
    } catch (error) {
        res.status(500).send("something went wrong when deleting")
    }
})

// UPDATE
app.put("/books/:id", async (req, res) => {
    
    try {
        // handle our checkbox
        if (req.body.completed === "on") {
            req.body.completed = true
        } else {
            req.body.completed = false
        }
        // Then find by id and update with the req.body
        // findByIdAndUpdate - id , data to update, options
        let updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true
            }
        )
    
        // redirect to the show route with the updated book
        res.redirect(`/books/${updatedBook._id}`)
        
    } catch (error) {
        res.send("something went wrong in this route")        
    }
})

// Create - POST
app.post("/books", async (req, res) => {
    try {
    if (req.body.completed === "on") {
        // if checked
        req.body.completed = true
    } else {
        // if not checked
        req.body.completed = false
    }
    // res.send(req.body)
    let newBook = await Book.create(req.body)
    // res.send(newBook)
    res.redirect("/books")

    // try{
    } catch(err) {
        res.send(err)
    }
})

// EDIT
app.get("/books/edit/:id", async (req, res) => {
    try {
        // find the book to edit
        let foundBook = await Book.findById(req.params.id)
        res.render("edit.ejs", {
            book: foundBook
        })
    } catch (error) {
        res.send("hello from the error")
    }
})

// Show - GET rendering only one book... last thing
app.get("/books/:id", async (req, res) => {
    // find by a book by _id
    // render show.ejs with the foundBook
    let foundBook = await Book.findById(req.params.id) // the request params object
    
    // console.log(foundBook)
    // render show.ejs with the foundBook
    res.render("show.ejs", {
        book: foundBook
    })
})

/**
 * SERVER LSITENER
 */

app.listen(PORT, () => console.log(`listening to the sounds of ${PORT}`))