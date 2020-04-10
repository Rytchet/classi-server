const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

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
  secretAccessKey: 'QnXCsFMhuhasj4GAP54yjRnIjj2HMh5hbvfKY0RK',
  accessKeyId: 'AKIAJ2Q2W3AUGNUXJ5YQ',
  region: 'eu-west-2',
});

const s3 = new aws.S3();

const fileFilter = (req, file, cb) => {
  console.log(file);
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, only JPEG and PNG allowed', false));
  }
};

const upload = multer({
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

const singleUpload = upload.single('image');

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

    return res.json({ imageUrl: req.file.location });
  });
});

// @route DELETE /api/images/avatars
// @desc Remove an avatar
// @access Private
router.delete('/avatars', auth, (req, res) => {
  User.findById(req.user.id).then((user) => {
    user.avatar_url = '';
    user.save();
    const filePath = path.join(__dirname, '../../public', user.avatar_url);
    fs.unlink(filePath, (err) => {
      if (err) throw err;
    });
    res.json({ success: true });
  });
});

const uploadListing = multer({
  dest: 'public/images/listings/temp',
});

// @route POST /api/images/listings/:id
// @desc Upload images for a listing
// @access Private
router.post(
  '/listings/:id',
  auth,
  uploadListing.array('photos', 10),
  (req, res) => {
    Listing.findById(req.params.id).then((listing) => {
      // Check if the user is allowed to upload the pictures
      if (req.user.id != listing.user_id) {
        res.status(403).json({ success: false, msg: 'Forbidden' });
      }

      // TODO: Figure out if it's possible to do this without the __dirname, bc its ugly
      const baseTargetPath = path.join(
        __dirname,
        '../../public/images/listings/',
        listing.id
      );

      // Check if all files are the correct format, if not delete all and 403
      req.files.forEach((file) => {
        const fileExtension = path.extname(file.originalname).toLowerCase();
        if (fileExtension != '.jpg' && fileExtension != '.png') {
          req.files.forEach((file) => {
            fs.unlink(file.path, (err) => {
              if (err) throw err;
            });
          });
          res.status(403).json({ success: false, msg: 'Wrong file types' });
        }
      });

      let pathList = [];

      // Create the folder for the pictures
      if (!fs.existsSync(baseTargetPath)) {
        fs.mkdirSync(baseTargetPath);
      }

      // Save the files in the listing folder
      req.files.forEach((file) => {
        let targetPath = path.join(baseTargetPath, file.originalname);
        console.log(file.path);
        console.log(targetPath);

        fs.rename(file.path, targetPath, (err) => {
          if (err) console.log(err);
        });

        pathList.push(
          '/images/listings/' + listing.id + '/' + file.originalname
        );
      });

      // Update the listing with a list of paths to the pictures
      listing.photos = pathList;
      listing.save();

      res.json({ success: true });
    });
  }
);

module.exports = router;
