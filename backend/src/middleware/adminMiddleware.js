const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Not authorized. Please login first.",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required.",
    });
  }

  next();
};

/*
  Alias kept so either naming can be used
  in protected admin routes.
*/
const protectAdmin = adminOnly;

export {
  adminOnly,
  protectAdmin,
};