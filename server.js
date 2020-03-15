const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const listings = require("./routes/api/listings");

const app = express();

// Bodyparser Middleware
app.use(bodyParser.json());

// TODO: Hide this string, and change the admin credentials
const uri =
  "mongodb://admin:admin123@classi-shard-00-00-e1uyo.mongodb.net:27017,classi-shard-00-01-e1uyo.mongodb.net:27017,classi-shard-00-02-e1uyo.mongodb.net:27017/test?ssl=true&replicaSet=Classi-shard-0&authSource=admin&retryWrites=true&w=majority";

// Connect to Mongoose
mongoose
  .connect(uri, {
    // These options are for fixing deprecation warnings for mongoose
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => console.log("Connected to database"))
  .catch(err => console.log(err));

// Use routes
app.use("/api/listings", listings);

// Run the server on localhost:5000
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on ${port}`));
