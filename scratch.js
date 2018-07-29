const GithubApi = require('github-api');

let getGithubAccount = (user) => {
			return new GithubApi({
		   username: 'JonathanWexler',
		   token: '123'
			});
		},
		filterIssueData = (data) => {
			return data;
		};


let gh = getGithubAccount();

// let rep = gh.getRepo('JonathanWexler','get-programming-with-nodejs')
let rep = gh.getIssues('JonathanWexler','get-programming-with-nodejs')
// console.log(rep)
rep.listIssues().then(c => console.log(c.data)).catch(e => console.log(e.message))
// rep.listIssues().then(c => console.log(c.data)).catch(e => console.log(e.message))
// .then(r => console.log(r))
// rep.forRepositories().then(r => console.log(r))
// console.log();

// .listIssues({repo: 92914276}).then((apiRes) =>{
// 	console.log(apiRes);
// 	// let issues = filterIssueData(apiRes.data)
//
// }).catch(function (error) {
// 	console.log(error.message);
//
// });
