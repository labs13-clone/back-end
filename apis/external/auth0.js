const axios = require('axios');

module.exports = {
    getPubKey
}

let pubKey;

//Get the public key from the Auth0 api to confirm the validity of the token
axios.get('https://labs13codingclone.auth0.com/.well-known/jwks.json')
    .then(res => {
        //Todo: auth0 documentation states sometimes there can be multiple keys returned by the JKWS key set API
        //Write function to validate the correct one is used
        //Reference: https://auth0.com/blog/navigating-rs256-and-jwks/#Finding-the-exact-signing-key
        pubKey = convertCertificate(res.data.keys[0].x5c[0]);
    })
    .catch(err=>{
        console.log('Error retrieving JKWS from Auth0', err);
    });

//Return the public key
//Only function exported from this module
function getPubKey() {
    return pubKey;
}

//Convert the certificate to the proper format
//Certificate must be in this specific format or else jwt won't be able to parse it
function convertCertificate (cert) {
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
        }
        else {
            result += '\n' + cert;
            cert = '';
        }
    }

    if (result[result.length ] != '\n')
        result += '\n';
    result += endCert + '\n';
    return result;
}