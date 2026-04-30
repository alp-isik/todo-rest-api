const express = require("express");
const router = express.Router();
const { Op } = require("sequelize"); //operator
const { Todo, Category, Status } = require("../models");
const isAuth = require("../middleware/middleware");

// Statuses: 1 = Not Started, 2 = Started, 3 = Completed, 4 = Deleted

// GET /todos - get all non-deleted todos for logged in user
router.get("/", isAuth, async (req, res) => {
  // #swagger.tags = ['Todos']
  // #swagger.description = 'Get all non-deleted todos for logged in user'
  try {
    const todos = await Todo.findAll({
      where: {
        UserId: req.user.id,
        StatusId: { [Op.ne]: 4 }, // operator.notequal - anything except deleted
      },
      include: [Category, Status],
    });

    return res
      .status(200)
      .json({ status: "success", data: { statusCode: 200, result: todos } });
  } catch (e) {
    return res
      .status(500)
      .json({ status: "error", result: "Something went wrong" });
  }
});

// GET /todos/all - get all todos including deleted
router.get("/all", isAuth, async (req, res) => {
  // #swagger.tags = ['Todos']
  // #swagger.description = 'Get all todos including deleted'
  try {
    const todos = await Todo.findAll({
      where: { UserId: req.user.id },
      include: [Category, Status],
    });

    return res
      .status(200)
      .json({ status: "success", data: { statusCode: 200, result: todos } });
  } catch (e) {
    return res
      .status(500)
      .json({ status: "error", result: "Something went wrong" });
  }
});

// GET /todos/deleted - get only deleted todos
router.get("/deleted", isAuth, async (req, res) => {
  // #swagger.tags = ['Todos']
  // #swagger.description = 'Get only deleted todos'
  try {
    const todos = await Todo.findAll({
      where: {
        UserId: req.user.id,
        StatusId: 4, // deleted status
      },
      include: [Category, Status],
    });

    return res
      .status(200)
      .json({ status: "success", data: { statusCode: 200, result: todos } });
  } catch (e) {
    return res
      .status(500)
      .json({ status: "error", result: "Something went wrong" });
  }
});

// GET /todos/statuses - get all statuses
router.get("/statuses", isAuth, async (req, res) => {
  // #swagger.tags = ['Todos']
  // #swagger.description = 'Get all available statuses'
  try {
    const statuses = await Status.findAll();
    return res
      .status(200)
      .json({ status: "success", data: { statusCode: 200, result: statuses } });
  } catch (e) {
    return res
      .status(500)
      .json({ status: "error", result: "Something went wrong" });
  }
});

// POST /todos - create a new todo
router.post("/", isAuth, async (req, res) => {
  // #swagger.tags = ['Todos']
  // #swagger.description = 'Create a new todo'
  try {
    const { name, description, CategoryId, StatusId } = req.body;

    if (!name || !description || !CategoryId || !StatusId)
      return res.status(400).json({
        status: "fail",
        data: {
          statusCode: 400,
          result: "name, description, CategoryId and StatusId are required",
        },
      });

    const todo = await Todo.create({
      name,
      description,
      CategoryId,
      StatusId,
      UserId: req.user.id,
    });

    return res
      .status(201)
      .json({ status: "success", data: { statusCode: 201, result: todo } });
  } catch (e) {
    return res
      .status(500)
      .json({ status: "error", result: "Something went wrong" });
  }
});

// PUT /todos/:id - update a todo
router.put("/:id", isAuth, async (req, res) => {
  // #swagger.tags = ['Todos']
  // #swagger.description = 'Update a specific todo'
  try {
    const todo = await Todo.findOne({
      where: { id: req.params.id, UserId: req.user.id },
    });

    if (!todo)
      return res.status(404).json({
        status: "fail",
        data: { statusCode: 404, result: "Todo not found" },
      });

    const { name, description, CategoryId, StatusId } = req.body;
    await todo.update({ name, description, CategoryId, StatusId });

    return res
      .status(200)
      .json({ status: "success", data: { statusCode: 200, result: todo } });
  } catch (e) {
    return res
      .status(500)
      .json({ status: "error", result: "Something went wrong" });
  }
});

// DELETE /todos/:id - set status to deleted
router.delete("/:id", isAuth, async (req, res) => {
  // #swagger.tags = ['Todos']
  // #swagger.description = 'Soft delete a todo by setting status to deleted'
  try {
    const todo = await Todo.findOne({
      where: { id: req.params.id, UserId: req.user.id },
    });

    if (!todo)
      return res.status(404).json({
        status: "fail",
        data: { statusCode: 404, result: "Todo not found" },
      });

    await todo.update({ StatusId: 4 }); // set to deleted, not actual DB delete

    return res.status(200).json({
      status: "success",
      data: { statusCode: 200, result: "Todo deleted" },
    });
  } catch (e) {
    return res
      .status(500)
      .json({ status: "error", result: "Something went wrong" });
  }
});

module.exports = router;
