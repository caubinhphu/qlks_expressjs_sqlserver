module.exports = function(req, res, next) {
  console.log(`${req.method}: ${req.protocol}://${req.hostname}${req.originalUrl} - ${Date()}`);
  next();
}