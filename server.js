const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
// const passport = require("passport");

const app = express();

// Bodyparser Middleware
app.use(express.json());

// DB Config
const uri = config.get("mongoURI");

// Connect to Mongoose
// TODO: Allow only safe IP's to access the database. Change this in the Security/Network Access section in MongoDB Atlas
mongoose
  .connect(uri, {
    // These options are for fixing deprecation warnings for mongoose
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => console.log("Connected to database"))
  .catch(err => console.log(err));

// // Passport middleware
// app.use(passport.initialize());

// // Passport config
// require("./config/passport")(passport);

// Use routes
app.use("/api/listings", require("./routes/api/listings"));
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/images", require("./routes/api/images"));

// Run the server on localhost:5000
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on ${port}`));
