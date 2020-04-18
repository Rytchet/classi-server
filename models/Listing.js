const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// TODO: Add pictures

const ListingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  photos: {
    type: Array,
    default: ['https://classi.s3.eu-west-2.amazonaws.com/carDefault'],
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
  },
  location: {
    postcode: {
      type: String,
      required: true,
    },
    region: {
      type: String,
    },
    city: {
      type: String,
    },
    lat: {
      type: String,
    },
    long: {
      type: String,
    },
  },
  car: {
    make: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    mileage: {
      type: Number,
      required: true,
    },
  },
  reported: {
    type: Boolean,
    default: false,
  },
  times_viewed: {
    type: Number,
    default: 0,
  },
  creation_date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Listing = mongoose.model('listing', ListingSchema);
