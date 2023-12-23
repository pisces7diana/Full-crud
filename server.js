/**
 * Dependencies
 */
require("dotenv").config() // this is how we make use of our .env variables
require("./config/db") // bring in our db config
const express = require("express")
const morgan = require("morgan") // logger
const methodOverride = require("method-override")
const bookRouter = require("./routes/books");

const app = express();
const { PORT = 3013 } = process.env; 
const seedData = require("./models/seed")

// Bring in our model
const Book = require("./models/Book")

/**
 * Middleware
 */
app.use((req, res, next) => {
    req.model = {
        Book,
        seedData
    }
    console.log("this is middleware")

    // go to the next app method
    next()
})
app.use(morgan("dev")) // logging
app.use(express.urlencoded({ extended: true })) // body parser this is how we get access to req.body
app.use(methodOverride("_method")) // Lets us use DELETE PUT HTTP verbs 
app.use("/public", express.static("public")) // server up our public directory the the url prefix of /public/styles.css
/**
 * Routes & Router
 */
// app.use(prefix url, router to execute)
app.use("/books", bookRouter)

/**
 * Server listener
 */
app.listen(PORT, () => console.log(`Listening to the sounds of ${PORT}`))