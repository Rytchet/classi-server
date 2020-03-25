const express = require("express");
const router = express.Router();
const multer = require("multer");
const auth = require("../../middleware/auth");
const path = require("path");
const fs = require("fs");

const User = require("../../models/User");
const Listing = require("../../models/Listing");

const uploadAvatar = multer({
  dest: "public/images/avatars/temp"
});

// @route POST /api/images/avatars
// @desc Upload an avatar
// @access Private
router.post("/avatars", auth, uploadAvatar.single("avatar"), (req, res) => {
  const tempPath = req.file.path;
  let targetPath = path.join(
    __dirname,
    "../../public/images/avatars",
    req.user.id
  );

  const fileExtension = path.extname(req.file.originalname).toLowerCase();
  targetPath = targetPath + fileExtension;

  // If the file is correct
  if (fileExtension === ".jpg" || fileExtension === ".png") {
    fs.rename(tempPath, targetPath, err => {});

    User.findById(req.user.id).then(user => {
      user.avatar_url = "/images/avatars/" + user.id + fileExtension;
      user.save();
    });

    res.json({ success: true });
  } else {
    fs.unlink(tempPath, err => {
      if (err) throw err;
    });
    res.status(403).json({ success: false, msg: "Wrong file type" });
  }
});

// @route DELETE /api/images/avatars
// @desc Remove an avatar
// @access Private
router.delete("/avatars", auth, (req, res) => {
  User.findById(req.user.id).then(user => {
    user.avatar_url = "";
    user.save();
    const filePath = path.join(__dirname, "../../public", user.avatar_url);
    fs.unlink(filePath, err => {
      if (err) throw err;
    });
    res.json({ success: true });
  });
});

// Temporarily removed
// router.get("/avatars/:id", (req, res) => {
//   res.sendFile(
//     path.join(__dirname, "../../public/images/avatars", req.params.id + ".jpg")
//   );
// });

const uploadListing = multer({
  dest: "public/images/listings/temp"
});

// @route POST /api/images/listings/:id
// @desc Upload images for a listing
// @access Private
router.post(
  "/listings/:id",
  auth,
  uploadListing.array("photos", 10),
  (req, res) => {
    Listing.findById(req.params.id).then(listing => {
      // Check if the user is allowed to upload the pictures
      if (req.user.id != listing.user_id) {
        res.status(403).json({ success: false, msg: "Forbidden" });
      }

      // TODO: Figure out if it's possible to do this without the __dirname, bc its ugly
      const baseTargetPath = path.join(
        __dirname,
        "../../public/images/listings/",
        listing.id
      );

      // Check if all files are the correct format, if not delete all and 403
      req.files.forEach(file => {
        const fileExtension = path.extname(file.originalname).toLowerCase();
        if (fileExtension != ".jpg" && fileExtension != ".png") {
          req.files.forEach(file => {
            fs.unlink(file.path, err => {
              if (err) throw err;
            });
          });
          res.status(403).json({ success: false, msg: "Wrong file types" });
        }
      });

      let pathList = [];

      // Create the folder for the pictures
      if (!fs.existsSync(baseTargetPath)) {
        fs.mkdirSync(baseTargetPath);
      }

      // Save the files in the listing folder
      req.files.forEach(file => {
        let targetPath = baseTargetPath + "\\" + file.originalname;

        fs.rename(file.path, targetPath, err => {
          console.log(err);
        });

        pathList.push(
          "/images/listings/" + listing.id + "/" + file.originalname
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
