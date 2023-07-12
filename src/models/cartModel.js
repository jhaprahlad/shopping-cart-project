const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      required: [true, "userId is required"],
      ref: "User",
      unique: true,
    },


    items: [
      {
        productId: {
          type: ObjectId,
          required: [true, "productId is required"],
          ref: "Product",
        },

        quantity: {
          type: Number,
          required: [true, "quantity is required"],
          min: [1, "minimum value of quantity should be 1"],
        },
      },
    ],


    totalPrice: {
      type: Number,
      required: [true, "totalPrice is required"],
      comment: "Holds total price of all the items in the cart",
    },
    totalItems: {
      type: Number,
      required: [true, "totalItems is required"],
      comment: "Holds total number of items in the cart",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);

/*{
  userId: {ObjectId, refs to User, mandatory, unique},
  items: [{
    productId: {ObjectId, refs to Product model, mandatory},
    quantity: {number, mandatory, min 1}
  }],
  totalPrice: {number, mandatory, comment: "Holds total price of all the items in the cart"},
  totalItems: {number, mandatory, comment: "Holds total number of items in the cart"},
  createdAt: {timestamp},
  updatedAt: {timestamp},
} */
