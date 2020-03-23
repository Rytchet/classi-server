const express = require("express");
const router = express.Router();
const multer = require("multer");
const auth = require("../../middleware/auth");
const path = require("path");
const fs = require("fs");

const upload = multer({
  dest: "images/avatars/temp"
});

router.post("/avatars", auth, upload.single("avatar"), (req, res) => {
  const tempPath = req.file.path;
  const targetPath = path.join(
    __dirname,
    "../../images/avatars",
    req.user.id + ".jpg"
  );

  console.log(req.file);
  console.log(targetPath);

  if (path.extname(req.file.originalname).toLowerCase() === ".jpg") {
    fs.rename(tempPath, targetPath, err => {});
    res.json({ success: true });
  } else {
    fs.unlink(tempPath, err => {});
    res.status(403).json({ success: false });
  }
});

router.get("/avatars/:id", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../images/avatars", req.params.id + ".jpg")
  );
});

module.exports = router;
