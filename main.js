import express from 'express';
import mongoose from 'mongoose';
import expressSession from 'express-session';
import morgan from 'morgan';
import expressLayouts from 'express-ejs-layouts';
import cookieParser from 'cookie-parser';
import '#mailer/sendgrid.js'
import dotenv from 'dotenv';
dotenv.config();

import GithubController from '#controllers/github.js';
import HomeController from '#controllers/home.js';
import AuthController from '#controllers/auth.js';

const app = express();
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static('public'));
app.use('/css', express.static('./node_modules/bootstrap/dist/css'));

// Middleware sessions
app.use(morgan('combined'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(expressSession({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

const navItems = [
	{
		action: 'Dashboard',
		path: '/'
	},
	{
		action: 'Profile',
		path: '/profile'
	},
	{
		action: 'My Repos',
		path: '/repos'
	}
];

// Passport
app.use(AuthController.initialize);
app.use(AuthController.session);
app.use((req, res, next) => {
	req.navItems = navItems.map(item => {
		return item.path === req.path
					? {...item, active: true}
					: item
	})
	next();
})

import {welcomeEmail} from '#mailer/sendgrid.js'


app.get('/email', (req, res) => {
	const { user: {username, email} } = req;
	welcomeEmail(username, email);
	res.redirect('/profile');
})
app.get('/login/github', AuthController.login );
app.get('/auth/github/callback', AuthController.authenticate, AuthController.successRedirect );

app.get('/', (req, res) => {
	const { user, navItems } = req;
	if (user) res.redirect('/profile');
	else res.render('index', {layout: false});
});

app.use((req, res, next) => {

	if (!req.user) {
		res.redirect('/');
	} else {
		next();
	}
});

app.get('/repos/:id/favorite', HomeController.favoriteRepo);
app.get('/profile', HomeController.profile);
app.get('/dashboard', HomeController.dashboard );

app.get('/repos/fetch', GithubController.fetchRepos );
app.get('/repo/:author/:repoName', GithubController.showRepo );
app.get('/repos', GithubController.repos );


app.listen(process.env.PORT, () => {
	console.log('listening');
})
