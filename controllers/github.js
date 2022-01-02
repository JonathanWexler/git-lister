import GithubApi from 'github-api';
import {User, Repo} from '#models/index.js';

const getGithubAccount = user => {
	const {username, githubToken: token} = user;
	return new GithubApi({
		username,
		token
	});
}
const filterRepoData = (data) => {
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
}
const updateRepoData = async (repos) => {
		let updatedRepos = [],
				data = filterRepoData(repos);

		data.forEach(async (repoData) => {
			const repo = await Repo.update(repoData, { where: {
				githubId: repoData.githubId
			}})
			updatedRepos.push(repo);
		});

		return updatedRepos;
}
const filterIssueData = (data) => {
	return data;
};

const repos = async (req, res) => {
	try {
		const {user: userObject} = req;
		const gh = getGithubAccount(userObject);

		console.log('GETTING REPO', gh);
		const apiRes = await gh.getUser()
			.listRepos();

		const data = updateRepoData(apiRes.data);

		const user = await User.findOne(
			{ where: {
			id: user.id
			}
		});

		data.forEach(async (repo) => {
			const newRepo = await Repo.create(repo)
			await user.addRepo(newRepo)
		});

		res.render('dashboard', {
			title: 'Repos',
			user,
			data: user.repos
		});
	} catch (error) {
		console.log(error.message);
		res.redirect('/profile');
	}
}
const showRepo = async (req, res) => {
	const {user: userObject} = req;
	let gh = getGithubAccount(userObject);

	let rep = gh.getIssues(req.params.author, req.params.repoName);
	try {
		const issueData = await rep.listIssues()
		let issues = filterIssueData(issueData.data);
		res.render('dashboard', {title: 'Issues', data: issues});
	}catch (error) {
		console.log(error.message);
		res.redirect('/profile');
	}
}
const updateUserFavorites = async (res, req, err, next) => {
	const user = await User.findOne({	where: {
		id: req.user.id
	}})
	// user.addRepo()
	res.redirect('/')
}

export default {
	updateUserFavorites,
	showRepo,
	repos,
	getGithubAccount,
	filterRepoData,
	filterIssueData,
};
