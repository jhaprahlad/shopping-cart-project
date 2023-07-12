const router = require("express").Router();
const {createUser, userLogin, getUserById, updateUser}= require("../controllers/userCtrl")
const {createProduct, getProducts, getProductByParamsId, updateProduct, deletedProduct}= require("../controllers/productCtrl")
const { createCart, updateCart, getCart, cartDelete} = require('../controllers/cartCtrl');
const { authentication } = require('../middlewares/auth');

router.get("/test", (req, res) => {
  res.send("API is working fine");
});

router.post('/register', createUser);
router.post('/login', userLogin);
router.get('/user/:userId/profile', authentication, getUserById) ;
router.put('/user/:userId/profile', authentication, updateUser) ;


router.post('/products', createProduct)
router.get('/products', getProducts);
router.get('/products/:productId', getProductByParamsId);
router.put('/products/:productId', updateProduct);
router.delete('/products/:productId', deletedProduct);



router.post('/users/:userId/cart', authentication, createCart);
router.put('/users/:userId/cart', authentication, updateCart);
router.put('/users/:userId/cart', auth, updateCart)
router.delete('/users/:userId/cart', auth, cartDelete)






module.exports = router;
