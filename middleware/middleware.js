const jwt = require("jsonwebtoken");

// Middleware function to determine if the API endpoint request is from an authenticated user
function isAuth(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({
      status: "fail",
      data: { statusCode: 401, result: "No token provided" },
    });
  }

  const token = authHeader.split(" ")[1]; // expecting: "Bearer <token>"

  try {
    const payload = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = payload; // attach user info to the request so routes can use it
    next();
  } catch (e) {
    return res.status(401).json({
      status: "fail",
      data: { statusCode: 401, result: "Invalid token" },
    });
  }
}

module.exports = isAuth;
