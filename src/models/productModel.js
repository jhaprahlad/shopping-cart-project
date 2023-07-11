const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      unique: true,
    },
    description: {
      type: String,
      required: [true, "description is required"],
      minimum: 0
    },
    price: {
      type: Number,
      required: [true, "price is required"],
    },
    currencyId: {
      type: String,
      enum: {
        values: ["INR"],
        message: "{VALUE} is not a valid CurrencyId, please enter valid currencyId"
    },
      required: [true, "currencyId is required"],
    },
    currencyFormat: {
      type: String,
      enum: {
        values: ["₹"],
        message: "{VALUE} is not a valid Currency format, please enter valid currencyFormat"
    },
      required: [true, "currencyFormat is required"],
      // Symbol: "₹",
    },
    isFreeShipping: {
      type: Boolean,
      default: false,
    },
    productImage: {
      type: String,
      required: [true, "productImage is required"],
    },
    style: {
      type: String,
    },
    availableSizes: {
      type: Array(String),
      required: true,
      enum: ["S", "XS", "M", "X", "L", "XXL", "XL"],
      uniqueItems: true

      // type:[{ 
      //   type: String, 
      // // minItems: 1,
      //   enum: {
      //     values: ["S", "XS", "M", "X", "L", "XXL", "XL"],
      //   },
      // }],
      // uniqueItems: true,
      // errorMessage: {
      //   minItems: "Please select at least one size",
      //   enum: "Please select a valid size from the available options: S, XS, M, X, L, XXL, XL",
      // },
    },
    installments: {
      type: Number,
    },
    deletedAt: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);

/*{ 
  title: {string, mandatory, unique},
  description: {string, mandatory},
  price: {number, mandatory, valid number/decimal},
  currencyId: {string, mandatory, INR},
  currencyFormat: {string, mandatory, Rupee symbol},
  isFreeShipping: {boolean, default: false},
  productImage: {string, mandatory},  // s3 link
  style: {string},
  availableSizes: {array of string, at least one size, enum["S", "XS","M","X", "L","XXL", "XL"]},
  installments: {number},
  deletedAt: {Date, when the document is deleted}, 
  isDeleted: {boolean, default: false},
  createdAt: {timestamp},
  updatedAt: {timestamp},
} */
