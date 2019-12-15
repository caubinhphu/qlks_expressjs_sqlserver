module.exports.isLeTan = (req, res, next) => {
  try {
    if(req.signedCookies.user.slice(0, 2) !== 'FO') {
      throw new Error('Không đúng quyền hạn!');
    } else {
      next();
    }
  } catch(err) {
    next(err);
  }
};