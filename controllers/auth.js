import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github'
import {User} from '#models';

const passportCallback = (accessToken, refreshToken, profile, next) => {
	const {id: githubId} = profile;
	User.findOne({ githubId }, (err, user) => {
		console.log('FINDING USER', user)
		if (!user) {
			console.log('CREATING USER', profile)
			User.create({
				githubId: profile.id,
				githubToken: accessToken,
				username: profile.username
			}, (err, user) => {
				return next(err, user);
			});
		} else {
			console.log('UPDATING USER', accessToken)
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
const authenticate = passport.authenticate('github', { failureRedirect: '/login/github' });
const successRedirect =(req, res) => {
	res.redirect('/profile');
}
const login = passport.authenticate('github', { scope: ['repo', 'repo:status', 'user', ] });
const initialize = passport.initialize();
const session = passport.session();

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
  },
	passportCallback
));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

export default {
	authenticate,
	successRedirect,
	login,
	initialize,
	session
};
