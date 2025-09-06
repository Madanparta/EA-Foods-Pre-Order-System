const authenticate = (req, res, next) => {
  const userType = req.headers['x-user-type'] || 'CUSTOMER';
  const userId = req.headers['x-user-id'] || 'demo-user';

  const validUserTypes = ['CUSTOMER', 'TSU', 'SR', 'OPS_MANAGER'];
  if (!validUserTypes.includes(userType)) {
    return res.status(401).json({
      error: 'Invalid user type',
    });
  }

  req.user = {
    id: userId,
    type: userType,
    name: req.headers['x-user-name'] || 'Demo User',
  };

  next();
};

const authorize = (...allowedTypes) => {
  return (req, res, next) => {
    if (!allowedTypes.includes(req.user.type)) {
      return res.status(403).json({
        error: 'Access denied. Insufficient permissions.',
      });
    }
    next();
  };
};

export { authenticate, authorize };
