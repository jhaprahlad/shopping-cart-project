const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      required: [true, "fname is required"],
    },
    lname: {
      type: String,
      required: [true, "lname is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (value) {
          return validator.isEmail(value);
        },
        message: "Email is invalid",
      },
    },
    profileImage: {
      type: String,
      required: [true, "profileimage is required"],
    },
    phone: {
      type: String,
      required: [true, "phone is required"],
      unique: true,
      trim: true,
      validate: {
        validator: function (value) {
          return validator.isMobilePhone(value, "en-IN");
        },
        message: "Phone number is invalid",
      },
    },
    password: {
      type: String,
      required: [true, "password is required"],
      min: [8, "password must be at least 8 characters"],
      max: [15, "password must be at most 15 characters"],
      trim: true,
    },
    address: {
      shipping: {
        street: {
          type: String,
          required: [true, "street is required"],
        },
        city: {
          type: String,
          required: [true, "city is required"],
        },
        pincode: {
          type: Number,
          required: [true, "pincode is required"],
        },
      },
      billing: {
        street: {
          type: String,
          required: [true, "street is required"],
        },
        city: {
          type: String,
          required: [true, "city is required"],
        },
        pincode: {
          type: Number,
          required: [true, "pincode is required"],
        },
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

/* { ~
  fname: {string, mandatory},
  lname: {string, mandatory},
  email: {string, mandatory, valid email, unique},
  profileImage: {string, mandatory}, // s3 link
  phone: {string, mandatory, unique, valid Indian mobile number}, 
  password: {string, mandatory, minLen 8, maxLen 15}, // encrypted password
  address: {
    shipping: {
      street: {string, mandatory},
      city: {string, mandatory},
      pincode: {number, mandatory}
    },
    billing: {
      street: {string, mandatory},
      city: {string, mandatory},
      pincode: {number, mandatory}
    }
  },
  createdAt: {timestamp},
  updatedAt: {timestamp}
}*/
