import GithubApi from 'github-api';

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
// let rep = gh.getIssues('JonathanWexler','get-programming-with-nodejs')
// rep.listIssues().then(c => console.log(c.data)).catch(e => console.log(e.message))
// rep.listIssues().then(c => console.log(c.data)).catch(e => console.log(e.message))
// .then(r => console.log(r))
// rep.forRepositories().then(r => console.log(r))

// .listIssues({repo: 92914276}).then((apiRes) =>{
// 	// let issues = filterIssueData(apiRes.data)
//
// }).catch(function (error) {
//
// });
let rep = gh.getRepo('JonathanWexler','get-programming-with-nodejs').getDetails().then( data => {
	let repoData = data.data;
	console.log(repoData)
}).catch(e => console.log(e.message));
// console
