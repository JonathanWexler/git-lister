const mongoose = require('mongoose');

const RepoSchema = new mongoose.Schema({
  title: String,
	githubId: String,
  description: String,
  author: String,
  issuesCount: Number,
  lastUpdated: Date,
}, {timestamps: true});

const Repo = mongoose.model('Repo', RepoSchema);

const UserSchema = new mongoose.Schema({
  username: String,
	githubId: String,
	githubToken: String,
  email: String,
  bio: String,
  image: String,
  hash: String,
  salt: String,
	repos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Repo' }]
}, {timestamps: true});

const User = mongoose.model('User', UserSchema);

module.exports = {

		User: User,
		Repo: Repo,
}
