const mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  username: String,
	githubId: String,
	githubToken: String,
  email: String,
  bio: String,
  image: String,
  hash: String,
  salt: String
}, {timestamps: true});


module.exports = {

		User: mongoose.model('User', UserSchema)
}
