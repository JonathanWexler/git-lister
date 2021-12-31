import GithubApi from 'github-api';
import {User, Repo} from '#models';

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
	res.render('dashboard', {title: 'Construbtion Database Management', issues: issues});
}
const profile = (req, res) => {
	// if (req.isAuthenticated()) {
	User.findOne({_id: req.user._id})
			.populate('favorites')
			.then( (user) => {
				res.render('profile', { user: user, repos: req.repos });
			});
}

export default {
	dashboard,
	profile
};
