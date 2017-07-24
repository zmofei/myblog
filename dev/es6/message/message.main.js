import Nav from '../component/nav.com.js';
import Http from '../component/http.js';

new Nav();


Http.fetch({
    url: 'https://api.github.com/users/zmofei?',
    success: function (data) {
        document.getElementById('gitFollower').innerText = data.data.followers;
        document.getElementById('gitRepos').innerText = data.data.public_repos;
        document.getElementById('gitRepos').innerText = data.data.public_repos;
        document.getElementById('gitFollowing').innerText = data.data.following;
        

        
        // let data = data.data.followers;
        // console.log(data.data);
    }
});
// console.log(Http)