module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "Category",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { timestamps: false },
  );

  Category.associate = function (models) {
    Category.belongsTo(models.User, { foreignKey: { allowNull: false } });
    Category.hasMany(models.Todo, { foreignKey: { allowNull: false } });
  };

  return Category;
};
