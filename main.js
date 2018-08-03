const express = require('express'),
	app = express(),
	cookieParser = require('cookie-parser'),
	mongoose = require('mongoose'),
	axios = require('axios'),
	GithubApi = require('github-api'),
	{User, Repo} = require('./models'),
	issues = require("./config/data.json"),
	github = require("./controllers/github.js"),
	home = require("./controllers/home.js");

//  DB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gitlister_db', { useNewUrlParser: true });

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
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

// Middleware
app.use((req, res, next) => {
	next();
});

app.get('/', (req, res) => {
	res.render('index');
});

app.get('/repos/:id/favorite', (req, res, next) => {

	Repo.findOne({_id: req.params.id })
			.then((repo) => {
				console.log(req.user)
				redirect('/repos')
			});
});
//
// 	let gh = controller.getGithubAccount(req.user);
// 	let rep = gh.getRepo(req.params.author, req.params.repoName)
// 							.getDetails()
// 							.then( data => {
// 								let repoData = data.data;
// 								// console.log(repoData);
//
// 								Repo.findOne({ githubId: repoData.id }, (err, repo) => {
//
// 									if (!repo) {
// 										console.log("CREATING")
// 										Repo.create({
// 											githubId: repoData.id,
// 											title: repoData.name,
// 											description: repoData.description,
// 											author: repoData.owner.login,
// 											issues_count: repoData.open_issues_count,
// 											lastUpdated: repoData.updated_at,
// 										}, (err, repo) => {
// 											console.log("CREATED");
// 											next(err, repo);
// 										});
// 									} else {
// 											next(err, repo);
// 									}
// 								});
// 							})
// 							.catch(e => console.log(e.message));
// }, updateUserFavorites);

app.get('/profile', home.profile);
app.get('/dashboard', home.dashboard );

app.get('/repo/:author/:repoName', github.showRepo );
app.get('/repos', github.repos );


app.listen(process.env.PORT || 3000, () => {
	console.log('listening');
})
