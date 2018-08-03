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
			count: repo.issuesCount,
			lastUpdated: repo.updated_at,
			isRepo: true
		})
	});

	return repos;
},
updateRepoData = (data) => {

		let updates = [];
		data.forEach((repo) => {
			let update = Repo.update({
										githubId: repo.id
									}, repo, {
										upsert: true,
										setDefaultsOnInsert: true
									});
			updates.push(update);

			// .then((repo) => console.log(repo))
			// .catch((err) => console.log(err.message));
		});

		return updates.reduce((promise, item) => {
							return promise.then(r => console.log(r));
						}, Promise.resolve());
},
filterIssueData = (data) => {
	console.log(data);
	return data;
};

module.exports = {

	updateUserFavorites: (res, req, err, next) => {
		console.log("At user spot");

		User.findOneAndUpdate({
			_id: req.user.id
		} , {
			$push:{
				repos: req.repo
			}
		}, {
			new:true
		}).then(() => {
			console.log("updated " )
			res.redirect('/')
		});
	},
	showRepo: (req, res) => {
		let gh = getGithubAccount(req.user);

		let rep = gh.getIssues(req.params.author, req.params.repoName);
		rep.listIssues().then( c => {
			// console.log(c.data);
			let issues = filterIssueData(c.data);
			res.render('dashboard', {title: 'Issues', data: issues});

		}).catch(e => {
			console.log(e.message);
			res.redirect('/profile');
		})
	},

	repos: (req, res) => {

		let gh = getGithubAccount(req.user);

		gh.getUser().listRepos().then((apiRes) =>{

			let repos = filterRepoData(apiRes.data);
			updateRepoData(repos)
					.then((d) => {
						console.log(d);
						res.render('dashboard', {title: 'Repos', data: repos});
					});


		}).catch(function (error) {
			console.log(error.message);
			res.redirect('/profile');

		});

	},


	getGithubAccount: getGithubAccount,
	filterRepoData: filterRepoData,
	filterIssueData: filterIssueData,

};
