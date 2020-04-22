const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');

function auth(req, res, next) {
  const token = req.header('x-auth-token');

  // Check for token
  if (!token) {
    // 401 Unauthorized
    res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.jwtSecret);

    // Add user from payload
    const id = decoded.id;
    User.findById(id).then((user) => {
      req.user = user;
      next();
    });
  } catch (e) {
    // 400 Bad Request
    res.status(400).json({ msg: 'Token is not valid' });
  }
}

module.exports = auth;
