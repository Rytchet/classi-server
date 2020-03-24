const express = require("express");
const router = express.Router();
const multer = require("multer");
const auth = require("../../middleware/auth");
const path = require("path");
const fs = require("fs");

const User = require("../../models/User");

const upload = multer({
  dest: "public/images/avatars/temp"
});

// @route POST /api/images/avatars
// @desc Upload an avatar
// @access Private
router.post("/avatars", auth, upload.single("avatar"), (req, res) => {
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
    res.status(403).json({ success: false });
  }
});

// @route DELETE /api/images/avatars
// @desc Remove an avatar
// @access Private
router.delete("/avatars", auth, (req, res) => {
  User.findById(req.user.id).then(user => {
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

module.exports = router;
