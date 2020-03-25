const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// TODO: Add pictures

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
  photos: [
    {
      type: String
    }
  ],
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
      type: Number
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
