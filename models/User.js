const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  avatar_url: {
    type: String
  },
  bio: {
    type: String
  },
  phone: {
    type: String
  },
  location: {
    postcode: {
      type: String
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
  favorites: [
    {
      type: String
    }
  ],
  browsing_history: [
    {
      id: {
        type: Schema.Types.ObjectId,
        ref: 'listing'
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  search_history: [
    {
      query: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  register_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model('user', UserSchema);
