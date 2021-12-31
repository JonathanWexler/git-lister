import express from 'express';
import mongoose from 'mongoose';
import expressSession from 'express-session';
import morgan from 'morgan';
import {User, Repo}  from './models.js';
import expressLayouts from 'express-ejs-layouts';
import cookieParser from 'cookie-parser';

// Unused
// import axios from 'axios';
// import GithubApi from 'github-api';
//  import issues from '#config/data.js';

import github from '#controllers/github.js';
import home from '#controllers/home.js';


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
import AuthController from '#controllers/auth.js';
app.use(AuthController.initialize);
app.use(AuthController.session);

app.get('/login/github', AuthController.login );
app.get('/auth/github/callback', AuthController.authenticate, AuthController.successRedirect );

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
