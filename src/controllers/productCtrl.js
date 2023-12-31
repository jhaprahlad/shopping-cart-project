const { uploadFiles } = require("../aws/aws");
const productModel = require("../models/productModel");
const { ObjectIdCheck } = require("../utils/validations");
const { sizeCheck } = require("../utils/proValidation");

const createProduct = async (req, res) => {
  try {
    const files = req.files;
    const {
      title,
      description,
      price,
      currencyId,
      currencyFormat,
      isFreeShipping,
      style,
      availableSizes,
      installments,
    } = req.body;

    const product = await productModel.findOne({ title });
    if (product) {
      return res
        .status(400)
        .json({ status: false, message: "Product Title already exists" });
    }

    if (Number.isNaN(parseFloat(price))) {
      return res
        .status(400)
        .json({ status: false, message: "Please enter valid price" });
    }
    if (
      !sizeCheck(
        availableSizes
          .toUpperCase()
          .split(",")
          .map((e) => e.trim())
      )
    ) {
      return res
        .status(400)
        .json({ status: false, message: "Please enter valid sizes" });
    }

    if (files.length === 0) {
      return res
        .status(400)
        .json({ status: false, message: "Please upload product image" });
    }
    let productImage = await uploadFiles(files[0]);

    const productDetail = {
      title: title,
      description: description,
      price: price,
      currencyId: currencyId,
      currencyFormat: currencyFormat,
      isFreeShipping: isFreeShipping,
      productImage: productImage,
      style: style,
      availableSizes: availableSizes
        .toUpperCase()
        .split(",")
        .map((e) => e.trim()),
      installments: installments,
    };
    const newProduct = await productModel.create(productDetail);
    return res
      .status(201)
      .json({ status: true, message: "Product Created", data: newProduct });
  } catch (error) {
    if (error.message.includes("duplicate")) {
      return res.status(400).json({ status: false, message: error.message });
    } else if (error.message.includes("validation")) {
      return res.status(400).json({ status: false, message: error.message });
    } else {
      return res.status(500).json({ status: false, message: error.message });
    }
  }
};

const getProducts = async function (req, res) {
  try {
    const name = req.query.name;
    const size = req.query.size;
    const priceLessThan = req.query.priceLessThan;
    const priceGreaterThan = req.query.priceGreaterThan;
    const priceSort = req.query.priceSort;

    if (!name && !priceLessThan && !priceGreaterThan && !size) {
      const products = await productModel
        .find({ isDeleted: false })
        .sort({ price: priceSort });
      if (products.length == 0) {
        return res
          .status(404)
          .send({ status: false, message: "No products are listed " });
      }
      return res
        .status(200)
        .send({ status: true, message: "Products List", data: products });
    }

    let filter = {};

    if (name) {
      filter.title = { $regex: name, $options: "i" };
    }

    if (size) {
      filter.availableSizes = { $in: [size] };
    }

    if (priceLessThan || priceGreaterThan) {
      filter.price = {};
      if (priceLessThan) {
        filter.price.$lt = priceLessThan;
      }
      if (priceGreaterThan) {
        filter.price.$gt = priceGreaterThan;
      }
    }
    const products = await productModel
      .find({ isDeleted: false, ...filter })
      .sort({ price: priceSort });
    if (products.length == 0) {
      return res
        .status(404)
        .send({ status: false, message: "No products are listed " });
    }
    return res
      .status(200)
      .send({ status: true, message: "Products List", data: products });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const getProductByParamsId = async (req, res) => {
  try {
    const productId = req.params.productId;
    if (!ObjectIdCheck(productId)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid productId" });
    }
    const product = await productModel.findOne({
      _id: productId,
      isDeleted: false,
    });
    if (!product) {
      return res
        .status(404)
        .json({ status: false, message: "Product not found" });
    }
    return res
      .status(200)
      .json({ status: true, message: "Product found", data: product });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    if (!ObjectIdCheck(productId)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid productId" });
    }
    const products = await productModel.findOne({
      _id: productId,
      isDeleted: false,
    });
    if (!products) {
      return res
        .status(404)
        .json({ status: false, message: "Product not found" });
    }

    const updateDetails = {};

    const files = req.files;
    const {
      title,
      description,
      price,
      currencyId,
      currencyFormat,
      isFreeShipping,
      style,
      availableSizes,
      installments,
    } = req.body;
    if (title) {
      const productByTitle = await productModel.findOne({ title });
      if (productByTitle) {
        return res
          .status(400)
          .json({ status: false, message: "Product Title already exists" });
      }
    }
    if (
      availableSizes &&
      !sizeCheck(
        availableSizes
          .toUpperCase()
          .split(",")
          .map((e) => e.trim())
      )
    ) {
      return res
        .status(400)
        .json({ status: false, message: "Please enter valid sizes" });
    }
    if (price && Number.isNaN(parseFloat(price))) {
      return res
        .status(400)
        .json({ status: false, message: "Please enter valid price" });
    }
    if (currencyId && currencyId != "INR") {
      return res
        .status(400)
        .json({ status: false, message: "Please enter valid currency" });
    }
    if (currencyFormat && currencyFormat != "₹") {
      return res
        .status(400)
        .json({ status: false, message: "Please enter valid currency format" });
    }
    if (files && files.length > 0) {
      updateDetails.productImage = await uploadFiles(files[0]);
    }

    if (title) {
      updateDetails.title = title;
    }
    if (description) {
      updateDetails.description = description;
    }
    if (price) {
      updateDetails.price = price;
    }
    if (currencyId) {
      updateDetails.currencyId = currencyId;
    }
    if (currencyFormat) {
      updateDetails.currencyFormat = currencyFormat;
    }
    if (isFreeShipping) {
      updateDetails.isFreeShipping = isFreeShipping;
    }
    if (style) {
      updateDetails.style = style;
    }
    // if(availableSizes){updateDetails.availableSizes=(availableSizes.toUpperCase().split(',')).map(e => e.trim())}
    if (installments) {
      updateDetails.installments = installments;
    }

    const product = await productModel.findOneAndUpdate(
      { isDeleted: false, _id: productId },
      {
        $set: updateDetails,
        $addToSet: {
          availableSizes: availableSizes
            .toUpperCase()
            .split(",")
            .map((e) => e.trim()),
        },
      },
      { new: true }
    );
    return res
      .status(200)
      .send({ status: true, message: "success", data: product });
  } catch (error) {
    if (error.message.includes("duplicate")) {
      return res.status(400).json({ status: false, message: error.message });
    } else if (error.message.includes("validation")) {
      return res.status(400).json({ status: false, message: error.message });
    } else {
      return res.status(500).json({ status: false, message: error.message });
    }
  }
};

const deletedProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        if (!ObjectIdCheck(productId)) {
            return res.status(400).json({ status: false, message: 'Please Enter valid productId' });
        }
        const product = await productModel.findOne({ _id: productId, isDeleted: false });
        if (!product) {
            return res.status(404).json({ status: false, message: 'Product not found' });
        }
        await productModel.findByIdAndUpdate(productId , { $set: { isDeleted: true } });
        return res.status(200).json({ status: true, message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
}


module.exports = {
  createProduct,
  getProducts,
  getProductByParamsId,
  updateProduct,
    deletedProduct,
};
