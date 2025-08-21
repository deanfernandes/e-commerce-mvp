const jwt = require("jsonwebtoken");

const authenticateJwt = (req, res, next) => {
  if (!req || !req.headers) {
    return res.send(400);
  }

  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
    if (err) {
      console.log(process.env.JWT_SECRET_KEY);
      console.log(err);
      return res.sendStatus(403);
    }

    req.user = payload.user;
    next();
  });
};

module.exports = authenticateJwt;
