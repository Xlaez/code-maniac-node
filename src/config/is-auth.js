const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const isAuth = req.get("Authorization");
  if (!isAuth) {
    const error = "Not authenticated";
    res.status(401).json({ error: error });
  }
  const token = isAuth.split("")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
  } catch (err) {
    err.status(500).json(err);
  }
  if (!decodedToken) {
    const error = new Error("Not authenticated");
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
};
