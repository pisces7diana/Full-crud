/**
 * Dependencies
 */
const mongoose = require("mongoose")

// connected to our database
mongoose.connect(process.env.DATABASE_URL)

// Connection status listeners
mongoose.connection.on("error", (err) => console.log(err.message + "oops there is an error"))
mongoose.connection.on("connected", () => console.log("connected to mongo"))
mongoose.connection.on("disconnected", () => console.log("disconnected from mongo"))