const GithubApi = require('github-api'),
	{User, Repo} = require('../models');

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
						lastUpdated: repo.updated_at,
						isRepo: true
					})
				});

				return repos;
			},
			filterIssueData = (data) => {
				console.log(data);
				return data;
			};

module.exports = {

	dashboard: (req, res) => {
		res.render('dashboard', {title: 'Construbtion Database Management', issues: issues});
	},

	profile: (req, res) => {
		// if (req.isAuthenticated()) {
		User.findOne({_id: req.user._id})
				.populate('favorites')
				.then( (user) => {
					res.render('profile', { user: user, repos: req.repos });
				});
	}
};
