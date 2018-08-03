const passport = require('passport'),
	GitHubStrategy = require('passport-github').Strategy,
	{User} = require('../models');


	passport.use(new GitHubStrategy({
	    clientID: process.env.GITHUB_CLIENT_ID,
	    clientSecret: process.env.GITHUB_CLIENT_SECRET,
	    callbackURL: process.env.DEV ? "http://localhost:3000/auth/github/callback" : "https://git-lister.herokuapp.com/auth/github/callback"
	  },
	  function(accessToken, refreshToken, profile, next) {

			User.findOne({ githubId: profile.id }, (err, user) => {
				if (!user) {
					User.create({
						githubId: profile.id,
						githubToken: accessToken,
						username: profile.username
					}, (err, user) => {
						return next(err, user);
					});
				} else {
					User.findOneAndUpdate({
						_id: user.id
					} , {
						$set:{
							githubToken: accessToken
						}
					}, {
						new:true
					}).then(() => {
						return next(err, user);
					});
				}
			});
	  }
	));

	passport.serializeUser(function(user, cb) {
	  cb(null, user);
	});

	passport.deserializeUser(function(obj, cb) {
	  cb(null, obj);
	});

module.exports = {
	authenticate: passport.authenticate('github', { failureRedirect: '/login/github' }),
	successRedirect:   function(req, res) {
	    res.redirect('/profile');
	  },
		login: passport.authenticate('github', { scope: ['repo', 'repo:status', 'user', ] }),
		initialize: passport.initialize(),
		session: passport.session()
};
