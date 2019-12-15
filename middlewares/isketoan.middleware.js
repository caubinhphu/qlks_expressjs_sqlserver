module.exports.isKeToan = (req, res, next) => {
  try {
    if(req.signedCookies.user.slice(0, 2) !== 'CA') {
      throw new Error('Không đúng quyền hạn!');
    } else {
      next();
    }
  } catch(err) {
    next(err);
  }
};