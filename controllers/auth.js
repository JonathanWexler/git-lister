import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github'
import {User} from '#models/index.js';

const passportCallback = async (accessToken, refreshToken, profile, next) => {
	let err = null;
	try {
		const {id: githubId} = profile;
		console.log('ABOUT TO FIND USER', githubId)
		let user = await User.findOne( { where: { githubId } });
		console.log('FINDING USER', user)
		if (!user) {
			console.log('CREATING USER', profile)
			let createdUser = await User.create({
				githubId: profile.id,
				githubToken: accessToken,
				username: profile.username
			});
			return next(err, createdUser);
		} else {
			console.log('UPDATING USER', user.id)
			const updatedUser = await User.update({
				githubToken: accessToken
			},
			{
				where: {
					id: user.id
				}
			})
			return next(err, updatedUser);
		}
	} catch (e) {
		console.log('ERROR:', e);
	}
	
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
