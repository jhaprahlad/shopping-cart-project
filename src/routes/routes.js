const router = require("express").Router();
const {createUser}= require("../controllers/userCtrl")

router.get("/test", (req, res) => {
  res.send("API is working fine");
});

router.post('/register', createUser)

module.exports = router;
