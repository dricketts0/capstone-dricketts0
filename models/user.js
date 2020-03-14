const passportLocalSequelize = require('passport-local-sequelize');

module.exports = (sequelize, Sequelize) => {
  let User = sequelize.define(
    'user',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: Sequelize.STRING,
      hash: Sequelize.TEXT,
      salt: Sequelize.TEXT,
      firstName: Sequelize.STRING,
      lastName: Sequelize.STRING,
      email: Sequelize.TEXT,
      budget: {
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0.00
      },
      totalSpent: {
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0.00
      },
      balance: {
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0.00
      },
      roleId: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      teamId: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
        allowNull: true,
      },
      supervisorId: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
    }, { freezeTableName: true },
  );

  passportLocalSequelize.attachToUser(User, {
    usernameField: 'username',
    hashField: 'hash',
    saltField: 'salt',
  });

  return User;
};
