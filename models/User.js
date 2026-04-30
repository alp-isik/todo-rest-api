module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      encryptedPassword: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      salt: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { timestamps: false },
  );

  User.associate = function (models) {
    User.hasMany(models.Todo, { foreignKey: { allowNull: false } });
    User.hasMany(models.Category, { foreignKey: { allowNull: false } });
  };

  return User;
};
