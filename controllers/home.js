import GithubApi from 'github-api';
import {User, Repo} from '#models/index.js';

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
	console.log(data);
	return data;
};

const favoriteRepo = async (req, res, next) => {
	console.log('FAVORITING', req.params.id, req.user.id)
	try {
		const user = await User.findOne( { where: { id: req.user.id } });

		console.log('usersss', user)
		const repo = await Repo.findOne({ where: {
			id: req.params.id
		}});
		await user.addFavorite(repo);
		res.redirect('/repos');
	} catch (e) {
		console.log(e)
	}
}

const dashboard = (req, res) => {
	res.render('dashboard', {title: 'Construbtion Database Management', issues});
}
const profile = async (req, res) => {
try {
	const {id} = req.user;
	const user = await User.findOne({ where: { id }, include: 'favorites'})
	// console.log(Object.keys(user.__proto__));

  // const favorites = await user.getFavorites()
	// req.repos
	res.render('profile', { user, repos: [] });
} catch (e) {
	console.log('HOME', e)
}

}

export default {
	dashboard,
	profile,
	favoriteRepo
};
