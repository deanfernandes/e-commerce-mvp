function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    const user = req.user;

    if (!user || !allowedRoles.includes(user)) {
      return res.status(403).json({ message: "Access denied." });
    }

    next();
  };
}

module.exports = authorizeRole;
