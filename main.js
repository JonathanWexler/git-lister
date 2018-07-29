const express = require('express'),
	app = express(),
	passport = require('passport'),
	cookieParser = require('cookie-parser'),
	mongoose = require('mongoose'),
	GitHubStrategy = require('passport-github').Strategy,
	{User} = require('./models'),
	axios = require('axios'),
	GithubApi = require('github-api'),
	issues = require("./config/data.json");

mongoose.connect('mongodb://localhost/gitlister_db');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
	next();
});

let getGithubAccount = (user) => {
			return gh = new GithubApi({
		   username: 'JonathanWexler',
		   token: user.githubToken
			});
		},
		filterRepoData = (data) => {
			let repos = [];

			data.forEach((repo) => {
				repos.push({
					title: repo.name,
					id: repo.id,
					description: repo.description,
					author: repo.owner.login,
					count: repo.issues_count,
					last_updated: repo.updated_at
				})
			});

			return repos;
		},
		filterIssueData = (data) => {
			console.log(data);
			return data;
		};


app.get('/', (req, res) => {
	res.render('index');
});

app.get('/repo/:repoName/:author', (req, res) => {
	let gh = getGithubAccount(req.user);

	console.log('APII')
	console.log(req.params.author)

	let rep = gh.getIssues(req.params.author, req.params.repoName);
	rep.listIssues().then( c => {
		// console.log(c.data);
		let issues = filterIssueData(c.data);
		res.render('dashboard', {title: 'Issues', data: issues});

	}).catch(e => {
		console.log(e.message);
			res.redirect('/profile');
	})
});

app.get('/dashboard', (req, res) => {
	res.render('dashboard', {title: 'Construbtion Database Management', issues: issues});
});



app.get('/issues', (req, res) => {

	let gh = getGithubAccount(req.user);
	gh.getUser().listRepos().then((apiRes) =>{
		console.log(apiRes.data[0]);
		let repos = filterRepoData(apiRes.data)
		res.render('dashboard', {title: 'Repos', data: repos});

	}).catch(function (error) {
    console.log(error.message);
		res.redirect('/profile');

  });

})

app.get('/profile', (req, res) => {
	if (req.isAuthenticated()) {
		console.log(req.repos);

		res.render('profile', {user: req.user, repos: req.repos});

	} else {
		res.redirect('/');
	}
});

app.get('/login/github', passport.authenticate('github', { scope: ['repo', 'repo:status', 'user', ] }));

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login/github' }),
  function(req, res) {
    // Successful authentication, redirect home.
		// req.user = user;
    res.redirect('/profile');
  });

// app.get('/login', passport.authenticate('local'))

app.listen(3000, () => {
	console.log('listening');
})

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, next) {

		User.findOne({ githubId: profile.id }, (err, user) => {
			console.log("FINDING")
			if (!user) {
				console.log("CREATING")
				User.create({
					githubId: profile.id,
					githubToken: accessToken,
					username: profile.username
				}, (err, user) => {
					console.log("CREATED");
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
					console.log("Found " )
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
