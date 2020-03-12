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
      roleId: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      teamId: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
        allowNull: true,
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
