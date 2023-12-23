/**
 * Dependencies
 */
// no middleware - remove the req.body. in front of Book
// const Book = require("../models/Book")


/**
 * Exports
 */
module.exports = {
    index,
    newForm,
    destroy,
    update,
    create,
    edit,
    show,
    seed
}

/**
 * Route Controllers
 */

async function index(req, res) {
    // find all of the books
    let books = await req.model.Book.find({})

    // render all of the books to index.ejs
    res.render("index.ejs", {
        books: books.reverse()
    })
}

async function newForm(req, res) {
    // render the create form
    res.render("new.ejs")
}

async function destroy(req, res) {
    try {
        // Find a book and then delete
        let deletedBook = await req.model.Book.findByIdAndDelete(req.params.id)
        // console.log(deletedBook)
        // redirect back to the index
        res.redirect("/books")
        
    } catch (error) {
        res.status(500).send("something went wrong when deleting")
    }
}
async function update(req, res)  {
    
    try {
        // handle our checkbox
        if (req.body.completed === "on") {
            req.body.completed = true
        } else {
            req.body.completed = false
        }
        // Then find by id and update with the req.body
        // findByIdAndUpdate - id , data to update, options
        let updatedBook = await req.model.Book.findByIdAndUpdate(
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
}

async function create(req, res) {
    try {
        if (req.body.completed === "on") {
            // if checked
            req.body.completed = true
        } else {
            // if not checked
            req.body.completed = false
        }
    
        let newBook = await req.model.Book.create(req.body)
        res.redirect("/books")

    } catch (err) {
        res.send(err)
    }
}
async function edit(req, res) {
    try {
        // find the book to edit
        let foundBook = await req.model.Book.findById(req.params.id)
        res.render("edit.ejs", {
            book: foundBook
        })
    } catch (error) {
        res.send("hello from the error")
    }
}

async function seed(req, res) {
    
    try {
        // delete everything in the database
        await req.model.Book.deleteMany({})
        // Create data in the database
        await req.model.Book.create(
            req.model.seedData
        )
        
        // redirect back to the index
        res.redirect("/books")
        
    } catch (error) {
        res.send("something went wrong with your seeds")
    }
}

async function show(req, res) {
    // find a book by _id
    let foundBook = await req.model.Book.findById(req.params.id) // the request params object

    // render show.ejs with the foundBook
    res.render("show.ejs", {
        book: foundBook
    })
}







