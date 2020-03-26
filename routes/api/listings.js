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
    .then(listing => {
      listing.times_viewed = listing.times_viewed + 1;
      listing.save();
      res.json(listing);
    })
    .catch(err => res.status(404).json({ err: "Listing not found" }));
});

// @route POST api/listings
// @desc Create a listing
// @access Private
router.post("/", auth, (req, res) => {
  const { title, price, description, phone, email, car } = req.body;
  const { make, model, year, mileage } = car;

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
      make,
      model,
      year,
      mileage
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
    .then(listing => {
      if (listing.user_id != req.user.id) {
        res.status(403).json({ success: false, msg: "Not authorized" });
      }
      listing.remove().then(() => res.json({ success: true })); // Return a 200 OK
    })
    .catch(err =>
      res.status(404).json({ success: false, msg: "Listing not found" })
    ); // Return 404 Not found;
});

// @route GET api/listings/popular
// @desc Get most viewed
// @access Public
router.get("/popular", (req, res) => {
  Listings.find()
    .sort({ times_viewed: "descending" })
    .then(listings => res.json(listings));
});

module.exports = router;
