function(user, context, callback) {
    var _ = require('lodash');
    var EXTENSION_URL = configuration.EXTENSION_URL;
  
    var audience = '';
    audience = audience || (context.request && context.request.query && context.request.query.audience);
    if (audience === 'urn:auth0-authz-api') {
      return callback(new UnauthorizedError('no_end_users'));
    }
  
    audience = audience || (context.request && context.request.body && context.request.body.audience);
    if (audience === 'urn:auth0-authz-api') {
      return callback(new UnauthorizedError('no_end_users'));
    }
  
    getPolicy(user, context,function(err,res,data){
           if(data.roles.length===0){
             updateUser(user,context,function(err,res,data){
               getPolicy(user, context,function(err,res,data){
                user.roles = data.roles;
      
                return callback(err, user, context);
                });
             });
            } else {
              getPolicy(user, context,function(err,res,data){
                user.roles = data.roles;
                return callback(err, user, context);
               });
            }
        });
   
    
    function updateUser(user, context, cb){
      request.patch({
        url: EXTENSION_URL + "/api/users/" + user.user_id + "/roles",
        headers: {
          "Authorization": `Bearer ${configuration.AUTH_KEY}`
        },
        json: ["f23a8715-aea0-4488-a51e-fd9959169138"], // user_role id
        timeout: 5000
        },cb);
    }
    
    // Convert groups to array
    function parseGroups(data) {
      if (typeof data === 'string') {
        // split groups represented as string by spaces and/or comma
        return data.replace(/,/g, ' ').replace(/\s+/g, ' ').split(' ');
      }
      return data;
    }
  
    // Get the policy for the user.
    function getPolicy(user, context, cb) {
      request.post({
        url: EXTENSION_URL + "/api/users/" + user.user_id + "/policy/" + context.clientID,
        headers: {
          "x-api-key": configuration.AUTHZ_EXT_API_KEY
        },
        json: {
          connectionName: context.connection || user.identities[0].connection,
          groups: parseGroups(user.groups)
        },
        timeout: 5000
      }, cb);
    }
   
  }