/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
var isAuthenticated = function(req, res, next) {
  if(!req.session.username) {
      res.redirect('/account/login');
  } else {
    next();
  }
}

module.exports = isAuthenticated
