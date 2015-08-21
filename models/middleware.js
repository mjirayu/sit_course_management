function isAuthenticated(req, res, next) {
    //return next();
    if (req.user) {
      return next();
    }
    res.redirect('/login');
}

module.exports = isAuthenticated;
