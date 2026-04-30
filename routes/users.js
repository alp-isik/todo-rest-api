const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

function hashPassword(salt, password) {
  return crypto
    .createHash("sha256")
    .update(salt + password)
    .digest("hex");
}

router.post("/signup", async (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.description = 'Register a new user'
  try {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim();
    const password = req.body.password?.trim();

    if (!name || !email || !password)
      return res.status(400).json({
        status: "fail",
        data: {
          statusCode: 400,
          result: "Name, email and password are required",
        },
      });

    if (!email.includes("@") || !email.includes("."))
      return res.status(400).json({
        status: "fail",
        data: { statusCode: 400, result: "Invalid email address" },
      });

    if (await User.findOne({ where: { email } }))
      return res.status(400).json({
        status: "fail",
        data: { statusCode: 400, result: "Email already in use" },
      });

    const salt = crypto.randomBytes(16).toString("hex");
    const encryptedPassword = hashPassword(salt, password);
    const user = await User.create({ name, email, encryptedPassword, salt });

    return res.status(201).json({
      status: "success",
      data: {
        statusCode: 201,
        result: { id: user.id, name: user.name, email: user.email },
      },
    });
  } catch (e) {
    return res
      .status(500)
      .json({ status: "error", result: "Something went wrong" });
  }
});

router.post("/login", async (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.description = 'Login and receive a JWT token'
  try {
    const email = req.body.email?.trim();
    const password = req.body.password?.trim();

    if (!email || !password)
      return res.status(400).json({
        status: "fail",
        data: { statusCode: 400, result: "Email and password are required" },
      });

    const user = await User.findOne({ where: { email } });
    if (!user || hashPassword(user.salt, password) !== user.encryptedPassword)
      return res.status(401).json({
        status: "fail",
        data: { statusCode: 401, result: "Invalid email or password" },
      });

    const payload = { id: user.id, name: user.name, email: user.email };
    const token = jwt.sign(payload, process.env.TOKEN_SECRET);

    return res.status(200).json({
      status: "success",
      data: { statusCode: 200, result: { token } },
    });
  } catch (e) {
    return res
      .status(500)
      .json({ status: "error", result: "Something went wrong" });
  }
});

module.exports = router;
