const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const axios = require('axios');

const Listing = require('../../models/Listing');
const User = require('../../models/User');

// @route GET api/listings
// @desc Get all listings
// @access Public
router.get('/', (req, res) => {
  req_query = req.query;
  query = {};

  if (req.query.user_id) {
    query = { user_id: req.query.user_id };
  } else {
    Object.keys(req_query).forEach((key) => {
      if (!isNaN(req_query[key])) {
        query[key] = parseInt(req_query[key]);
        return;
      }
      query[key] = { $regex: req_query[key], $options: 'i' };
    });
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
router.put('/search', (req, res) => {
  if (req.body.q) {
    Listing.find({ $text: { $search: req.body.q } })
      .sort({ creation_date: 'descending' })
      .then((listings) => res.json(listings));
  } else {
    let req_query = req.body;
    let query = {};

    Object.keys(req_query).forEach((key) => {
      if (req_query[key] == '') return;
      else if (!isNaN(req_query[key])) {
        query[key] = parseInt(req_query[key]);
        return;
      } else if (typeof req_query[key] == 'string') {
        query[key] = { $regex: req_query[key], $options: 'i' };
        return;
      } else if (req_query[key]['$lte'] == '' && req_query[key]['$gte'] == '') {
        return;
      } else if (req_query[key]['$lte'] != '') {
        query[key] = {};
        query[key]['$lte'] = parseInt(req_query[key]['$lte']);
        if (req_query[key]['$gte'] != '') {
          query[key]['$gte'] = parseInt(req_query[key]['$gte']);
        }
      } else if (req_query[key]['$gte'] != '') {
        query[key] = {};
        query[key]['$gte'] = parseInt(req_query[key]['$gte']);
      } else {
        query[key] = req_query[key];
      }
    });

    Listing.find(query)
      .sort({ date: -1 }) // Sort by date descending
      .then((listings) => res.json(listings))
      .catch((err) => res.status(404).json({ err: 'No listings found' }));
  }
});

// @route GET api/listings/recommended/:user_id
// @desc Get recommended listings for a user
// @access Private
router.get('/recommended/:user_id', (req, res) => {
  User.findById(req.params.user_id)
    .then(async function (user) {
      // Dont make recommendations if user browsed less than 3 listings
      if (user.browsing_history.length < 3) {
        Listing.find()
          .sort({ times_viewed: 'descending' })
          .limit(3)
          .then((listings) => res.json(listings));
      }

      let counter = { makes: [], models: [], years: [] };
      let i = 0;

      let mostViewed = await Listing.find()
        .sort({ times_viewed: 'descending' })
        .limit(1)
        .then((listings) => listings);

      user.browsing_history.forEach((entry) => {
        let id = entry._id;

        Listing.findById(id).then(async function (listing) {
          counter.makes.push(listing.car.make);
          counter.models.push(listing.car.model);
          counter.years.push(listing.car.year);
          i += 1;

          if (i == user.browsing_history.length - 1) {
            function mode(arr) {
              return arr
                .sort(
                  (a, b) =>
                    arr.filter((v) => v === a).length -
                    arr.filter((v) => v === b).length
                )
                .pop();
            }

            let make = mode(counter.makes);
            let model = mode(counter.models);
            let year = mode(counter.years);

            let recommendations = [];

            let listing = await Listing.find({ 'car.make': make })
              .sort({ times_viewed: -1 })
              .limit(1);
            await recommendations.push(...listing);

            listing = await Listing.find({ 'car.model': model })
              .sort({ creation_date: -1 })
              .limit(1);
            if (listing[0]._id == recommendations[0]._id) {
              await recommendations.push(mostViewed);
            } else {
              await recommendations.push(...listing);
            }

            listing = await Listing.find({
              'car.year': { $lte: year + 5 },
              'car.year': { $gte: year - 5 },
            })
              .sort({ creation_date: -1 })
              .limit(1);
            await recommendations.push(...listing);

            res.json(recommendations);
          }
        });
      });
    })
    .catch((err) => {
      Listing.find()
        .sort({ times_viewed: 'descending' })
        .limit(3)
        .then((listings) => res.json(listings));
    });
});

router.put('/report/:id', (req, res) => {
  Listing.findById(req.params.id)
    .then((listing) => {
      listing.reported = true;
      listing.save();
      res.json({ msg: 'Success' });
    })
    .catch((e) => {
      res.status(404).json({ msg: 'Listing not found' });
    });
});

router.put('/approve/:id', auth, (req, res) => {
  if (req.user.email != 'admin@classi.com') {
    res.status(403).json({ msg: 'Not authorised (need admin)' });
  }
  Listing.findById(req.params.id)
    .then((listing) => {
      listing.reported = false;
      listing.save();
      res.json({ msg: 'Success' });
    })
    .catch((e) => {
      res.status(404).json({ msg: 'Listing not found' });
    });
});

// @route GET api/listings/:id/:user_id
// @desc Get a listing with user
// @access Public
router.get('/:id/:user_id', (req, res) => {
  Listing.findById(req.params.id)
    .then((listing) => {
      // If there is a user passed, save the ID into his browsing history
      if (req.params.user_id) {
        User.findById(req.params.user_id).then((user) => {
          user.browsing_history.push(listing.id);
          user.save();
        });
      }

      listing.times_viewed = listing.times_viewed + 1;
      listing.save();
      res.json(listing);
    })
    .catch((err) => res.status(404).json({ err: 'Listing not found' }));
});

// @route GET api/listings/:id/
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

// @route GET api/listings/:id/
// @desc Get a listing
// @access Public
router.put('/:id', auth, (req, res) => {
  Listing.findById(req.params.id)
    .then((listing) => {
      listing.title = req.body.title;
      listing.price = req.body.price;
      listing.description = req.body.description;
      listing.car.make = req.body.car.make;
      listing.car.model = req.body.car.model;
      listing.car.year = req.body.car.year;
      listing.car.mileage = req.body.car.mileage;
      listing.save().then((l) => res.json(l));
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
      if (
        listing.user_id != req.user.id &&
        req.user.email != 'admin@classi.com'
      ) {
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
