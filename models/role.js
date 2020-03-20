module.exports = (sequelize, Sequelize) => {
  return sequelize.define(
    'role',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      name: Sequelize.STRING,
    },
    { freezeTableName: true },
  );
};
