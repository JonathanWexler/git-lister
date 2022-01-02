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

const dashboard = (req, res) => {
	res.render('dashboard', {title: 'Construbtion Database Management', issues});
}
const profile = async (req, res) => {
try {
	const [id] = req.user;
	const user = await User.findOne({ where: { id }})
	console.log('UUUSER', user)
	const favorites = await user.getFavoritess()
	console.log('favorites', favorites);
	user.favorites = []
	// req.repos
	res.render('profile', { user, repos: [] });
} catch (e) {
	console.log('HOME', e)
}

}

export default {
	dashboard,
	profile
};
