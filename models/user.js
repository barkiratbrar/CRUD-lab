const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String },
  oauthId: { type: String },
  oauthProvider: { type: String },
  created: { type: Date, default: Date.now },
});

userSchema.plugin(plm);

module.exports = mongoose.model('User', userSchema);
