/////////////////////////////////
// Import Our Dependencies
////////////////////////////////
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const path = require('path');

/////////////////////////////////
// Database Connection
////////////////////////////////
const DATABASE_URL = process.env.DATABASE_URL;
const CONFIG = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Establish Connection
mongoose.connect(DATABASE_URL, CONFIG);

// Events for when connection opens/disconnects/errors
mongoose.connection
  .on("open", () => console.log("Connected to Mongoose"))
  .on("close", () => console.log("Disconnected from Mongoose"))
  .on("error", (error) => console.log(error));

/////////////////////////////////
// Models
////////////////////////////////
const { Schema, model } = mongoose;

//make health Schema
const healthSchema = new Schema({
    name: String,
    weight: String,
    entry: String,
    readyForWorkout: Boolean,
});

//make Health model
const Health = model('Health', healthSchema)

/////////////////////////
// App Object Setup
////////////////////////
const app = express()
app.engine('jsx', require('express-react-views').createEngine());
app.set('view engine', 'jsx')

///////////////////////////
// Middleware
//////////////////////////
app.use(morgan("tiny")); //logging
app.use(methodOverride("_method")); // override for put and delete requests from forms
app.use(express.urlencoded({ extended: true })); // parse urlencoded request bodies
app.use(express.static("public")); // serve files from public statically

///////////////////
// Routes
//////////////////
app.get("/", (req, res) => {
    res.send("your server is running... better catch it.");
  });

  app.get('/health/seed', (req, res) => {
    const startHealth = [
        { name: "Kelly", weight: "130", entry: "Feeling great! Can't wait to get this workout in!", readyForWorkout: true,}
    ];
      
    Health.deleteMany({}).then((data) => {
        Health.create(startHealth).then((data) => {
            res.json(data);
        })
    }).catch((err) => {
        res.status(400).send(err)
    })
})

////////////////////
// Server Listener
/////////////////////
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Now Listening on port ${PORT}`))