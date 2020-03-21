const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

// Listings model
const Listing = require("../../models/Listing");

// @route GET api/listings
// @desc Get all listings
// @access Public
router.get("/", (req, res) => {
  Listing.find()
    .sort({ date: -1 }) // Sort by date descending
    .then(listings => res.json(listings));
});

// @route GET api/listings/:id
// @desc Get a listing
// @access Public
router.get("/:id", (req, res) => {
  Listing.findById(req.params.id).then(listing => res.json(listing));
});

// @route POST api/listings
// @desc Create a listing
// @access Private
router.post("/", auth, (req, res) => {
  const newListing = new Listing({
    title: req.body.title,
    price: req.body.price
  });

  newListing.save().then(listing => res.json(listing));
});

// @route DELETE api/listings/:id
// @desc Delete a listing
// @access Private
router.delete("/:id", auth, (req, res) => {
  Listing.findById(req.params.id)
    .then(listing => listing.remove().then(() => res.json({ success: true }))) // Return a 200 OK
    .catch(err => res.status(404).json({ success: false })); // Return 404 Not found;
});

module.exports = router;
