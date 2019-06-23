const axios = require('axios');

module.exports = {
    pubKey,
    getPubKey,
    getUserProfile
}

let publicKey;

//Return the public key
function pubKey() {
    return publicKey;
}

//Get the public key from the Auth0 api to confirm the validity of the token
function getPubKey() {

    return axios.get('https://labs13codingclone.auth0.com/.well-known/jwks.json')
        .then(res => {
            publicKey = getSigningKey(res.data.keys);

            return null;
        })
        .catch(err => {
            console.log('Error retrieving JKWS from Auth0', err);
        });
}

//Get the user profile information from the Auth0 api
//The information is used to get the user's Github picture and nickname
function getUserProfile(accessToken) {
 
    return axios({
            method: 'get',
            url: `https://labs13codingclone.auth0.com/userinfo`,
            headers: {
                Authorization: accessToken
            }
        })
        .then(res => {
            return res.data;
        })
        .catch(err => {
            console.log(err)
            console.log('Error retrieving user profile information from Auth0', err.message);
        });
}

//auth0 documentation states sometimes there can be multiple keys returned by the JKWS key set API
//Write function to validate the correct one is used
//Reference: https://auth0.com/blog/navigating-rs256-and-jwks/#Finding-the-exact-signing-key
function getSigningKey(keys) {
    if (!keys || !keys.length) {
        console.log('The JWKS endpoint did not contain any keys');
    }

    const signingKeys = keys
        .filter(key => key.use === 'sig' // JWK property `use` determines the JWK is for signing
            &&
            key.kty === 'RSA' // We are only supporting RSA (RS256)
            &&
            key.kid // The `kid` must be present to be useful for later
            &&
            ((key.x5c && key.x5c.length) || (key.n && key.e)) // Has useful public keys
        ).map(key => {
            return {
                kid: key.kid,
                nbf: key.nbf,
                publicKey: convertCertificate(key.x5c[0])
            };
        });

    // If at least one signing key doesn't exist we have a problem... Kaboom.
    if (!signingKeys.length) {
        console.log('The JWKS endpoint did not contain any keys');
    }

    return signingKeys[0].publicKey;
}


//Convert the certificate to the proper format
//Certificate must be in this specific format or else jwt won't be able to parse it
function convertCertificate(cert) {
    var beginCert = '-----BEGIN CERTIFICATE-----';
    var endCert = '-----END CERTIFICATE-----';

    cert = cert.replace('\n', '');
    cert = cert.replace(beginCert, '');
    cert = cert.replace(endCert, '');

    var result = beginCert;
    while (cert.length > 0) {

        if (cert.length > 64) {
            result += '\n' + cert.substring(0, 64);
            cert = cert.substring(64, cert.length);
        } else {
            result += '\n' + cert;
            cert = '';
        }
    }

    if (result[result.length] != '\n')
        result += '\n';
    result += endCert + '\n';
    return result;
}