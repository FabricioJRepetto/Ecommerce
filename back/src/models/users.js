const { DataTypes } = require("sequelize");

module.exports = sequelize => {
  sequelize.define(
    "user",
    {
      id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      salt: {},
      password: {},
      hashedPass: {},
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
};
