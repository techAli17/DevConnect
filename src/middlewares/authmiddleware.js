const adminAuthMiddleware = (req, res, next) => {
  const token = "isAdmin";
  const isValidToken = token === "isAdmin";
  if (!isValidToken) res.status(401).send("Not authorize");
  // else res.status(200).send("Authorize");
  else next();
};
const userAuthMiddleware = (req, res, next) => {
  const token = "isAdmin";
  const isValidToken = token === "isAdmin";
  if (!isValidToken) res.status(401).send("Not authorize");
  // else res.status(200).send("Authorize");
  else next();
};

module.exports = {
  adminAuthMiddleware,
  userAuthMiddleware,
};
