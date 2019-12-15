module.exports.isQuanLy = (req, res, next) => {
  try {
    if(req.signedCookies.user.slice(0, 2) !== 'MN') {
      throw new Error('Không đúng quyền hạn!');
    } else {
      next();
    }
  } catch(err) {
    next(err);
  }
};