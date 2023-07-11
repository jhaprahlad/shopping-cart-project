const router = require("express").Router();

router.get("/test", (req, res) => {
  res.send("API is working fine");
});

module.exports = router;
