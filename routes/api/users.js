const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');

// Listings model
const User = require('../../models/User');
const Listing = require('../../models/Listing');

// @route POST api/users
// @desc Register new user
// @access Public
router.post('/', (req, res) => {
  const { name, email, password } = req.body;

  // TODO: Update fields with new model

  // Simple validation
  if (!name || !email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  // Check for existing user
  User.findOne({ email }).then((user) => {
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    const newUser = new User({
      name,
      email,
      password,
    });

    // Create salt and hash
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser.save().then((user) => {
          jwt.sign(
            { id: user.id },
            config.get('jwtSecret'),
            {
              expiresIn: 3600,
            },
            (err, token) => {
              if (err) throw err;
              res.json({
                token,
                user: {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                },
              });
            }
          );
        });
      });
    });
  });
});

// TODO: Implement this better, don't send all info

// @route GET api/users
// @desc Get the profile of a user
// @access Public
router.get('/:id/profile', (req, res) => {
  User.findById(req.params.id).then((user) => res.json(user));
});

// TODO: Delete this, not secure
// @route GET api/users
// @desc Get all users
// @access Public
router.get('/', (req, res) => {
  User.find().then((users) => res.json(users));
});

// @route GET api/users/:id
// @desc Get all info of a User
// @access Public
router.get('/:id', (req, res) => {
  User.findById(req.params.id).then((user) => res.json(user));
});

router.put('/:id', (req, res) => {
  User.findById(req.params.id).then((user) => {
    user.name = req.body.name;
    user.save();
    res.json(user);
  });
});

// @route PUT api/users/favorites/:listingId
// @desc Favorite a listing
// @access Private
router.put('/favorites/:id', auth, (req, res) => {
  console.log(req);
  User.findById(req.user.id).then((user) => {
    // Check if listing is valid
    Listing.findById(req.params.id)
      .then((listing) => {
        // Create array if doesnt exist
        if (!user.favorites) {
          user.favorites = [];
        }

        // Add to array
        if (user.favorites.indexOf(req.params.id) > -1) {
          res.json({ msg: 'Success' });
        } else {
          user.favorites.push(req.params.id);
          user.save();
          res.json({ msg: 'Success' });
        }
      })
      .catch((err) => {
        res.status(400).json({ msg: 'Listing does not exist' });
      });
  });
});

// @route DELETE api/users/favorites/:listingId
// @desc Unfavorite a listing
// @access Private
router.delete('/favorites/:id', auth, (req, res) => {
  User.findById(req.user.id).then((user) => {
    const index = user.favorites.indexOf(req.params.id);
    if (index > -1) {
      user.favorites.splice(index, 1);
    }
    user.save();
    res.json({ msg: 'Success' });
  });
});

module.exports = router;
