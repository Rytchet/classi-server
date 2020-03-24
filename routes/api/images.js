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

router.post("/avatars", auth, upload.single("avatar"), (req, res) => {
  const tempPath = req.file.path;
  let targetPath = path.join(
    __dirname,
    "../../public/images/avatars",
    req.user.id
  );

  console.log(req.file);
  console.log(targetPath);

  const fileExtension = path.extname(req.file.originalname).toLowerCase();
  targetPath = targetPath + fileExtension;

  if (fileExtension === ".jpg" || fileExtension === ".png") {
    fs.rename(tempPath, targetPath, err => {});
    res.json({ success: true });

    let user = User.findById(req.user.id);
    user.avatar_url = targetPath;
    user.save();
  } else {
    fs.unlink(tempPath, err => {});
    res.status(403).json({ success: false });
  }
});

// Temporarily removed
// router.get("/avatars/:id", (req, res) => {
//   res.sendFile(
//     path.join(__dirname, "../../public/images/avatars", req.params.id + ".jpg")
//   );
// });

module.exports = router;
