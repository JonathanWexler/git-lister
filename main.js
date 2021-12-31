import express from 'express';
import mongoose from 'mongoose';
import axios from 'axios';
import expressSession from 'express-session';
import morgan from 'morgan';
import {User, Repo}  from './models.js';
import expressLayouts from 'express-ejs-layouts';
import GithubApi from 'github-api';
import cookieParser from 'cookie-parser';

import github from './controllers/github.js';
import home from './controllers/home.js';

import issues from './config/data.js';

const app = express();

//  DB
mongoose.connect(
	process.env.MONGODB_URI || 'mongodb://localhost:27017/gitlister_db',
	{ useNewUrlParser: true }
);

// Middleware
// app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static('public'));

// Middleware sessions
app.use(morgan('combined'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(expressSession({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

// Passport
import auth from './controllers/auth.js';
app.use(auth.initialize);
app.use(auth.session);

app.get('/login/github', auth.login );
app.get('/auth/github/callback', auth.authenticate, auth.successRedirect );

app.get('/', (req, res) => {
	res.render('index', {layout: false});
});

app.use((req, res, next) => {

	if (!req.user) {
		res.redirect('/');
	} else {
		next();
	}
});

app.get('/repos/:id/favorite', (req, res, next) => {

	User.update({_id: req.user._id}, {$addToSet: {favorites: req.params.id} })
			 .then((r) => {
			 	res.redirect('/repos');
			 });
});

app.get('/profile', home.profile);
app.get('/dashboard', home.dashboard );

app.get('/repo/:author/:repoName', github.showRepo );
app.get('/repos', github.repos );


app.listen(process.env.PORT || 3000, () => {
	console.log('listening');
})
