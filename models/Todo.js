module.exports = (sequelize, DataTypes) => {
  const Todo = sequelize.define(
    "Todo",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { timestamps: false },
  );

  Todo.associate = function (models) {
    Todo.belongsTo(models.Category, { foreignKey: { allowNull: false } });
    Todo.belongsTo(models.Status, { foreignKey: { allowNull: false } });
    Todo.belongsTo(models.User, { foreignKey: { allowNull: false } });
  };

  return Todo;
};
