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
			title: repo.title || repo.name,
			githubId:  repo.githubId || repo.id,
			description: repo.description,
			author: repo.author || repo.owner.login,
			issuesCount: repo.issuesCount,
			lastUpdated: repo.lastUpdated || repo.updated_at,
			isRepo: true
		})
	});

	return repos;
},
updateRepoData = (repos) => {

		let reposToUpdate = [],
				updatedRepos = [],
				data = filterRepoData(repos);

		data.forEach((repo) => {
			let update = Repo.findOneAndUpdate({
										githubId: repo.id
									}, repo, {
										"upsert": true,
										"setDefaultsOnInsert": true,
										"new": true
									}).then(r => updatedRepos.push(r));

			reposToUpdate.push(update);
		});

		return Promise.all(reposToUpdate).then((values) => {
			console.log("values updated");
			return updatedRepos;
		}).catch( e => console.log(e));

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

			let issues = filterIssueData(c.data);
			res.render('dashboard', {title: 'Issues', data: issues});

		}).catch(e => {
			console.log(e.message);
			res.redirect('/profile');
		})
	},

	repos: (req, res) => {

		let user = req.user,
				gh = getGithubAccount(user);

		gh.getUser()
			.listRepos()
			.then( (apiRes) =>{

				updateRepoData(apiRes.data)
						.then((data) => {

							let total = [],
									results =[];

							data.forEach((repo) => {

								let update = User.update({
															_id: user._id
														},
														{
															$addToSet: {
																repos: repo._id
															}
														},
														{
															upsert: true,
															setDefaultsOnInsert: true,
															new: true
														})
														.then(r => results.push(r))
														.catch(err => console.log(err));

								total.push(update);
							});

							Promise.all(total)
										 .then(() => {
											 User.findOne({_id: user._id})
											 		 .populate('repos')
													 .then((theUser) => {
														 console.log(theUser.repos)

														 res.render('dashboard', {title: 'Repos', data: theUser.repos});
											 	 	 });
										 });

						});
			})
			.catch(function (error) {
				console.log(error.message);
				res.redirect('/profile');
			});


	},

	getGithubAccount: getGithubAccount,
	filterRepoData: filterRepoData,
	filterIssueData: filterIssueData,

};
