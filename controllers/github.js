import GithubApi from 'github-api';
import {User, Repo} from '#models';

let getGithubAccount = (user) => {
	return gh = new GithubApi({
		username: user.username,
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
										githubId: repo.githubId
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
	return data;
};

export default {

	updateUserFavorites: (res, req, err, next) => {

		User.findOneAndUpdate({
			_id: req.user.id
		} , {
			$push:{
				repos: req.repo
			}
		}, {
			new:true
		}).then(() => {
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
											 		 .populate('repos', null, null, { sort: { 'lastUpdated': -1 } })
													 .then((user) => {
														 user.repos.forEach((repo) => {
															 let fav = user.favorites.some((fav) => { return fav.equals(repo._id)}) ;
															 if (fav) {
															 	repo.isFav = true;
															 }
														 })
														 res.render('dashboard', {title: 'Repos', user: user, data: user.repos });
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
