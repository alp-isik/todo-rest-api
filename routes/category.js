const express = require("express");
const router = express.Router();
const { Category, Todo } = require("../models");
const isAuth = require("../middleware/middleware");

// GET /category - get all categories for logged in user
router.get("/", isAuth, async (req, res) => {
  // #swagger.tags = ['Category']
  // #swagger.description = 'Get all categories for logged in user'
  try {
    const categories = await Category.findAll({
      where: { UserId: req.user.id },
    });
    return res.status(200).json({
      status: "success",
      data: { statusCode: 200, result: categories },
    });
  } catch (e) {
    return res
      .status(500)
      .json({ status: "error", result: "Something went wrong" });
  }
});

// POST /category - create a new category for logged in user
router.post("/", isAuth, async (req, res) => {
  // #swagger.tags = ['Category']
  // #swagger.description = 'Create a new category'
  try {
    const { name } = req.body;

    if (!name)
      return res.status(400).json({
        status: "fail",
        data: { statusCode: 400, result: "Name is required" },
      });

    const category = await Category.create({ name, UserId: req.user.id });
    return res
      .status(201)
      .json({ status: "success", data: { statusCode: 201, result: category } });
  } catch (e) {
    return res
      .status(500)
      .json({ status: "error", result: "Something went wrong" });
  }
});

// PUT /category/:id - update a category
router.put("/:id", isAuth, async (req, res) => {
  // #swagger.tags = ['Category']
  // #swagger.description = 'Update a category'
  try {
    const category = await Category.findOne({
      where: { id: req.params.id, UserId: req.user.id },
    });

    if (!category)
      return res.status(404).json({
        status: "fail",
        data: { statusCode: 404, result: "Category not found" },
      });

    const { name } = req.body;

    if (!name)
      return res.status(400).json({
        status: "fail",
        data: { statusCode: 400, result: "Name is required" },
      });

    await category.update({ name });
    return res
      .status(200)
      .json({ status: "success", data: { statusCode: 200, result: category } });
  } catch (e) {
    return res
      .status(500)
      .json({ status: "error", result: "Something went wrong" });
  }
});

// DELETE /category/:id - delete a category only if no todos are using it
router.delete("/:id", isAuth, async (req, res) => {
  // #swagger.tags = ['Category']
  // #swagger.description = 'Delete a category if no todos are assigned to it'
  try {
    const category = await Category.findOne({
      where: { id: req.params.id, UserId: req.user.id },
    });

    if (!category)
      return res.status(404).json({
        status: "fail",
        data: { statusCode: 404, result: "Category not found" },
      });

    const todoUsingCategory = await Todo.findOne({
      where: { CategoryId: req.params.id },
    });

    if (todoUsingCategory)
      return res.status(400).json({
        status: "fail",
        data: {
          statusCode: 400,
          result: "Category is assigned to a todo and cannot be deleted",
        },
      });

    await category.destroy();
    return res.status(200).json({
      status: "success",
      data: { statusCode: 200, result: "Category deleted" },
    });
  } catch (e) {
    return res
      .status(500)
      .json({ status: "error", result: "Something went wrong" });
  }
});

module.exports = router;
