const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const config = require("config");
const User = mongoose.model("user");

const key = config.get("jwtSecret");
