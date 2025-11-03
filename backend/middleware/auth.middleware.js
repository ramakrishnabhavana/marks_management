export const auth = async (req, res, next) => {
  // No authentication required - allow all requests
  next();
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    // No authorization required - allow all requests
    next();
  };
};
