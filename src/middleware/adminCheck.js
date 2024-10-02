const adminCheck = (req, res, next) => {
    const { userType } = req.body; // Assuming `req.user` contains user info after authentication
    if (userType !== 'admin') {
      return res.status(403).json({ data: req.body, message: 'Access denied. Admins only.' });
    }
    next();
  };

  
  module.exports = adminCheck