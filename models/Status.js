module.exports = (sequelize, DataTypes) => {
  const Status = sequelize.define(
    "Status",
    {
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { timestamps: false },
  );

  return Status;
};
