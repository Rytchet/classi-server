const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const axios = require('axios');

// Listings model
const Listing = require('../../models/Listing');

// @route GET api/listings
// @desc Get all listings
// @access Public
router.get('/', (req, res) => {
  query = {};
  if (req.query.user_id) {
    query = { user_id: req.query.user_id };
  }

  Listing.find(query)
    .sort({ date: -1 }) // Sort by date descending
    .then((listings) => res.json(listings))
    .catch((err) => res.status(404).json({ err: 'No listings found' }));
});

// @route GET api/listings/popular
// @desc Get most viewed
// @access Public
router.get('/popular', (req, res) => {
  Listing.find()
    .sort({ times_viewed: 'descending' })
    .then((listings) => res.json(listings));
});

// @route GET api/listings/search
// @desc Search listings
// @access Public
router.get('/search', (req, res) => {
  Listing.find({ $text: { $search: req.query.q } })
    .sort({ creation_date: 'descending' })
    .then((listings) => res.json(listings));
});

// @route GET api/listings/:id
// @desc Get a listing
// @access Public
router.get('/:id', (req, res) => {
  Listing.findById(req.params.id)
    .then((listing) => {
      listing.times_viewed = listing.times_viewed + 1;
      listing.save();
      res.json(listing);
    })
    .catch((err) => res.status(404).json({ err: 'Listing not found' }));
});

// @route POST api/listings
// @desc Create a listing
// @access Private
router.post('/', auth, (req, res) => {
  const { title, price, description } = req.body;
  const { make, model, year, mileage } = req.body.car;

  const postcode = req.body.location.postcode;
  let region, city, lat, long;

  const phone = req.body.phone || req.user.phone;
  const email = req.body.email || req.user.email;

  axios
    .get('https://api.postcodes.io/postcodes/' + encodeURI(postcode))
    .then((postcodeRes) => {
      region = postcodeRes.data.result.region;
      city = postcodeRes.data.result.admin_district;
      lat = postcodeRes.data.result.latitude;
      long = postcodeRes.data.result.longitude;

      const newListing = new Listing({
        title,
        price,
        description,
        user_id: req.user.id,
        phone,
        email,
        location: {
          postcode,
          region,
          city,
          lat,
          long,
        },
        car: {
          make,
          model,
          year,
          mileage,
        },
        times_viewed: 0,
      });

      newListing.save().then((listing) => res.json(listing));
    })
    .catch((err) => res.status(400).json({ msg: 'Wrong postcode' }));
});

// @route DELETE api/listings/:id
// @desc Delete a listing
// @access Private
router.delete('/:id', auth, (req, res) => {
  Listing.findById(req.params.id)
    .then((listing) => {
      if (listing.user_id != req.user.id) {
        res.status(403).json({ success: false, msg: 'Not authorized' });
      }
      listing.remove().then(() => res.json({ success: true })); // Return a 200 OK
    })
    .catch((err) =>
      res.status(404).json({ success: false, msg: 'Listing not found' })
    ); // Return 404 Not found;
});

module.exports = router;

// Example on how to do filters
// app.get('/employees', (req, res) => {
//   const { firstName, lastName, age } = req.query;
//   let results = [...employees];
//   if (firstName) {
//     results = results.filter(r => r.firstName === firstName);
//   }

//   if (lastName) {
//     results = results.filter(r => r.lastName === lastName);
//   }

//   if (age) {
//     results = results.filter(r => +r.age === +age);
//   }
//   res.json(results);
// });
