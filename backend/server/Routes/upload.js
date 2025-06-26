const express = require("express");
const router = express.Router();
const { upload } = require("../../utils/cloudinary");

router.post("/upload", upload.single("image"), (req, res) => {
  try {
    return res.status(200).json({ imageUrl: req.file.path });
  } catch (err) {
    return res.status(500).json({ error: "Upload failed", details: err.message });
  }
});

module.exports = router;
