function (user, context, callback) {
    var namespace = configuration.NAMESPACE;
    context.idToken[namespace + 'user_authorization'] = {
      roles: user.roles,
    };
    return callback(null, user, context);
  }