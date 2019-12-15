module.exports.isVatTu = (req, res, next) => {
  try {
    if(req.signedCookies.user.slice(0, 2) !== 'KH') {
      throw new Error('Không đúng quyền hạn!');
    } else {
      next();
    }
  } catch(err) {
    next(err);
  }
};