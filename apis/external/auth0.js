const axios = require('axios');

module.exports = {
    getKid
}

let kid;

//Get the kid from the Auth0 api to confirm the validity of the token
//The kid should match the kid in the header of the token
axios.get('https://labs13codingclone.auth0.com/.well-known/jwks.json')
    .then(res => {
        kid = res.data.keys[0].kid;
    })
    .catch(err=>{
        console.log('Error retrieving JKWS from Auth0', err);
    });

function getKid() {
    return kid;
}