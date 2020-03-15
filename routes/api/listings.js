const express = require("express");
const router = express.Router();

// Listings model
const Listing = require("../../models/Listing");

// @route GET api/listings
// @desc Get all listings
// @access Public
router.get("/", (req, res) => {
  Listing.find()
    .sort({ date: -1 }) // Sort by date descending
    .then(items => res.json(items));
});

// @route POST api/listings
// @desc Create a listing
// @access Public
router.post("/", (req, res) => {
  const newListing = new Listing({
    title: req.body.title,
    price: req.body.price
  });

  newListing.save().then(listing => res.json(listing));
});

// @route DELETE api/listings/:id
// @desc Delete a listing
// @access Public
router.delete("/:id", (req, res) => {
  Listing.findById(req.params.id)
    .then(listing => listing.remove().then(() => res.json({ success: true }))) // Return a 200 OK
    .catch(err => res.status(404).json({ success: false })); // Return 404 Not found;
});

module.exports = router;
