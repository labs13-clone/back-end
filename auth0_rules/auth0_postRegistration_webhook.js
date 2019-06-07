/**
@param {object} user - The user being created
@param {string} user.id - user id
@param {string} user.tenant - Auth0 tenant name
@param {string} user.username - user name
@param {string} user.email - email
@param {boolean} user.emailVerified - is e-mail verified?
@param {string} user.phoneNumber - phone number
@param {boolean} user.phoneNumberVerified - is phone number verified?
@param {object} user.user_metadata - user metadata
@param {object} user.app_metadata - application metadata
@param {object} context - Auth0 connection and other context info
@param {string} context.requestLanguage - language of the client agent
@param {object} context.connection - information about the Auth0 connection
@param {object} context.connection.id - connection id
@param {object} context.connection.name - connection name
@param {object} context.connection.tenant - connection tenant
@param {object} context.webtask - webtask context
@param {function} cb - function (error, response)
*/
var request = require('request@2.88.0')
module.exports = function (user, context, cb) {
  function getToken(callback){
    request.post({
      url: "https://labs13codingclone.auth0.com/oauth/token",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      form: { 
        "grant_type": 'client_credentials',
        "client_id" : context.webtask.secrets.CLIENT_ID,
        "client_secret": context.webtask.secrets.CLIENT_SECRET,
        "audience": 'https://labs13codingclone.auth0.com/api/v2/' },
      timeout: 5000
      },callback);
  }
  
 function setUser(err,res,data){
        request.post({
      url:  `https://labs13codingclone.auth0.com/api/v2/users/auth0|${user.id}/roles`,
      headers: {
        "Authorization": `Bearer ${data}`,
        "Content-Type": "application/json"
      },
      json: { 
         "roles": ["rol_6ia8dWokw6o8fD2I"] 
        },
      timeout: 5000
      },function(err,res,data){
        cb()
        });
    }
    //}, cb);
  //}
  getToken(function(err,res,data){
    const creds = JSON.parse(data);
    setUser(err,res,creds.access_token);
});

};