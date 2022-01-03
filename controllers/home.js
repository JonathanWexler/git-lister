import GithubApi from 'github-api';
import {
	User,
	Repo
} from '#models/index.js';

const getGithubAccount = (user) => {
	return gh = new GithubApi({
		username: 'JonathanWexler',
		token: user.githubToken
	});
};
const filterRepoData = (data) => {
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
};
const filterIssueData = (data) => {
	return data;
};

const favoriteRepo = async (req, res, next) => {
	try {
		const user = await User.findOne({
			where: {
				id: req.user.id
			}
		});

		const repo = await Repo.findOne({
			where: {
				id: req.params.id
			}
		});
		await user.addFavorite(repo);
		res.redirect('/repos');
	} catch (e) {
		console.log(e)
	}
}

const dashboard = (req, res) => {
	renderPage(req, res, 'dashboard', {title: 'Construbtion Database Management',	issues});
}
const profile = async (req, res) => {
	try {
		const {
			id
		} = req.user;
		const user = await User.findOne({
			where: {
				id
			},
			include: 'favorites'
		})
		// console.log(Object.keys(user.__proto__));
		renderPage(req, res, 'profile', {user, repos: []})
	} catch (e) {
		console.log('Error', e)
	}
}

const renderPage = (req, res, page, options) => {
	const {user, navItems} = req;
	options = {user, ...options, navItems}
	res.render(page, options);
}
export default {
	dashboard,
	profile,
	favoriteRepo
};
