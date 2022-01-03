import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github'
import {User} from '#models/index.js';
import {welcomeEmail} from '#mailer/sendgrid.js'

const passportCallback = async (githubToken, refreshToken, profile, next) => {
	let err = null;
	try {
		const {id: githubId, username, _json} = profile;
		const {email, name, avatar_url: imageURL} = _json
		const [firstName, lastName] = name.split(' ');

		let user = await User.findOne( { where: { githubId } });
		if (!user) {
			const createdUser = await User.create({
				githubId,
				githubToken,
				firstName,
				lastName,
				username,
				email,
				imageURL
			});
			if (createdUser) {
				console.log('Created new user', createdUser.username, createdUser.email)
				welcomeEmail(createdUser.username, createdUser.email)
			}
			return next(err, createdUser);
		} else {
			user.githubToken = githubToken;
			await user.save();
			return next(err, user);
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
