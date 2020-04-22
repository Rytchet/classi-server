const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const dotenv = require('dotenv');
dotenv.config();

// Models
const User = require('../../models/User');
const Listing = require('../../models/Listing');

// const path = require('path');
// const fs = require('fs');

// For image uploads
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

aws.config.update({
  secretAccessKey: process.env.S3_SECRET,
  accessKeyId: process.env.S3_KEY,
  region: 'eu-west-2',
});

const s3 = new aws.S3();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, only JPEG and PNG allowed', false));
  }
};

const uploadAvatar = multer({
  fileFilter,
  storage: multerS3({
    acl: 'public-read',
    s3,
    bucket: 'classi',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: 'TEST_METADATA' });
    },
    key: function (req, file, cb) {
      cb(null, req.user.id);
    },
  }),
});

const singleUpload = uploadAvatar.single('avatar');

// @route POST /api/images/avatars
// @desc Upload an avatar
// @access Private
router.post('/avatars', auth, (req, res) => {
  singleUpload(req, res, function (err) {
    if (err) {
      return res
        .status(422)
        .json({ msg: 'Image upload error', detail: err.message });
    }

    User.findById(req.user.id).then((user) => {
      user.avatar_url = req.file.location;
      user.save();
    });

    return res.json({ url: req.file.location });
  });
});

// @route DELETE /api/images/avatars
// @desc Remove an avatar
// @access Private
router.delete('/avatars', auth, (req, res) => {
  const params = { Bucket: 'classi', Key: req.user.id };

  s3.deleteObject(params, function (err, data) {
    if (err) {
      return res
        .status(422)
        .json({ msg: 'Error in deleting avatar', detail: err.message });
    } else {
      User.findById(req.user.id).then((user) => {
        user.avatar_url = undefined;
        user.save();
      });
      return res.json({ msg: 'Success' });
    }
  });
});

const uploadPhotos = multer({
  fileFilter,
  storage: multerS3({
    acl: 'public-read',
    s3,
    bucket: 'classi',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: 'TEST_METADATA' });
    },
    key: function (req, file, cb) {
      cb(null, req.params.id + file.originalname);
    },
  }),
});

const arrayUpload = uploadPhotos.array('photos');

// @route POST /api/images/listings/:id
// @desc Upload images for a listing
// @access Private
router.post('/listings/:id', auth, (req, res) => {
  Listing.findById(req.params.id).then((listing) => {
    if (listing.user_id != req.user.id) {
      return res.status(403).json({ msg: 'This listing was not made by you' });
    }
  });

  arrayUpload(req, res, function (err) {
    if (err) {
      return res
        .status(422)
        .json({ msg: 'Image upload error', detail: err.message });
    }

    urls = [];

    req.files.forEach((file) => {
      urls.push(file.location);
    });

    Listing.findById(req.params.id).then((listing) => {
      listing.photos = urls;
      listing.save();
    });

    return res.json({ urls });
  });
});

module.exports = router;
