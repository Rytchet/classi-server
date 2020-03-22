const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ListingSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  phone: {
    type: String
  },
  email: {
    type: String
  },
  location: {
    postcode: {
      type: String,
      required: true
    },
    region: {
      type: String
    },
    city: {
      type: String
    },
    lat: {
      type: String
    },
    long: {
      type: String
    }
  },
  car: {
    make: {
      type: String
    },
    model: {
      type: String
    },
    year: {
      type: Number
    },
    mileage: {
      type: String
    }
  },
  times_viewed: {
    type: Number
  },
  creation_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Listing = mongoose.model("listing", ListingSchema);
