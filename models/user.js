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
      // firstName: Sequelize.STRING,
      // lastName: Sequelize.STRING,
      // email: Sequelize.STRING,
      username: Sequelize.STRING,
      hash: Sequelize.TEXT,
      salt: Sequelize.TEXT,
      roleId: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      // teamId: {
      //   type: Sequelize.INTEGER,
      //   defaultValue: 0,
      // },
    }, { freezeTableName: true },
  );

  passportLocalSequelize.attachToUser(User, {
    usernameField: 'username',
    hashField: 'hash',
    saltField: 'salt',
  });

  return User;
};
