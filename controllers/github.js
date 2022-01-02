import GithubApi from 'github-api';
import {User, Repo} from '#models/index.js';

const getGithubAccount = user => {
	console.log('user', user)
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
		const updatedRepos = [];
		const data = filterRepoData(repos);

		data.forEach(async (repoData) => {
			const repo = await Repo.update(repoData, { where: {
				githubId: repoData.githubId
			}})
			console.log(repoData)
			updatedRepos.push(repo);
		});
		console.log('DONE')


		return updatedRepos;
}
const filterIssueData = (data) => {
	return data;
};

const createOrUpdateRepos = async (repos, user) => {
	const data = filterRepoData(repos);

	for (let repoData of data) {
		try {
			const {githubId} = repoData;
			await Repo.upsert({...repoData, UserId: user.id}, {where: { githubId }})
		} catch (error) {
			console.log("Err", error)
		}
	}
}

const fetchRepos = async (req, res) => {
	const {user: userObject} = req;
	const gh = getGithubAccount(userObject);
	const {data: apiRes} = await gh.getUser()
		.listRepos();

	const user = await User.findOne({
		where: {
			id: userObject.id
		}
	});

	await createOrUpdateRepos(apiRes, user);
	res.redirect('/repos');
}

const repos = async (req, res) => {
	try {
		const {user: userObject} = req;
		const user = await User.findOne({
			where: {
				id: userObject.id
			}
		});

		const repos = await user.getRepos();
		const favorites = (await user.getFavorites()).map(f => f.id);
		for (let r of repos) {
			if (favorites.includes(r.id)) r.isFav = true;
		}
		res.render('dashboard', {
			title: 'Repos',
			user,
			data: repos
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
	fetchRepos,
	showRepo,
	repos,
	getGithubAccount,
	filterRepoData,
	filterIssueData,
};
