const router = require("express").Router();
const {createUser, userLogin,getUserById, updateUser}= require("../controllers/userCtrl")
const { authentication } = require('../middlewares/auth');

router.get("/test", (req, res) => {
  res.send("API is working fine");
});

router.post('/register', createUser);
router.post('/login', userLogin);
router.get('/user/:userId/profile', authentication, getUserById) ;
router.put('/user/:userId/profile', authentication, updateUser) ;



module.exports = router;
