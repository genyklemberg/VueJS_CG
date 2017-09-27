module.exports.logout = (req, res) => {
  req.logout();
  res.send({message: `You are logout`})
};

module.exports.login = (req, res) => {
  const { email, id, name, surname, confirmed } = req.user;
  req.logIn({ email, id, name, surname, confirmed }, err => {
    if (err) {
      res.send({error: 'Sorry! We are not able to log you in!'});
    }
    res.send({success: true})
  });
};

module.exports.isUserAuth = (req) => {
  return Boolean(req.user && (req.user.email || req.user.steam_id));
};

module.exports.isAuth = (req, res) => {
  res.send({isAuth: this.isUserAuth(req)});
};
