module.exports.indexAuth = (req, res, next) => {
  res.render('auth/index', {
    title: 'login'
  })
};