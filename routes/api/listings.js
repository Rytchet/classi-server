const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

// Listings model
const Listing = require("../../models/Listing");

// @route GET api/listings
// @desc Get all listings
// @access Public
router.get("/", (req, res) => {
  query = {};
  if (req.query.user_id) {
    query = { user_id: req.query.user_id };
  }

  Listing.find(query)
    .sort({ date: -1 }) // Sort by date descending
    .then(listings => res.json(listings))
    .catch(err => res.status(404).json({ err: "No listings found" }));
});

// @route GET api/listings/:id
// @desc Get a listing
// @access Public
router.get("/:id", (req, res) => {
  Listing.findById(req.params.id)
    .then(listing => res.json(listing))
    .catch(err => res.status(404).json({ err: "Listing not found" }));
});

// @route POST api/listings
// @desc Create a listing
// @access Private
router.post("/", auth, (req, res) => {
  const { title, price, description, phone, email } = req.body;

  // TODO: Figure out how to get the car vars nicely

  const newListing = new Listing({
    title,
    price,
    description,
    user_id: req.user.id,
    phone,
    email,
    // TODO: Implement the postcode API here
    location: {
      postcode: req.body.location.postcode
      //   region: req.body.region,
      //   city: req.body.city,
      //   lat: req.body.lat,
      //   long: req.body.long
    },
    car: {
      make: req.body.car.make,
      model: req.body.car.model,
      year: req.body.car.year,
      mileage: req.body.car.mileage
    },
    times_viewed: 0
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
