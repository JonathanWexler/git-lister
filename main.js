const express = require('express'),
	app = express(),
	cookieParser = require('cookie-parser'),
	mongoose = require('mongoose'),
	axios = require('axios'),
	GithubApi = require('github-api'),
	expressLayouts = require('express-ejs-layouts'),
	{User, Repo} = require('./models'),
	issues = require("./config/data.json"),
	github = require("./controllers/github.js"),
	home = require("./controllers/home.js");

//  DB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gitlister_db', { useNewUrlParser: true });

// Middleware
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static('public'));

// Middleware sessions
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

// Passport
const auth = require('./controllers/auth');
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
