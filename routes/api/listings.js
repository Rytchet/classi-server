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

module.exports = router;
