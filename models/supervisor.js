module.exports = (sequelize, Sequelize) => {
  let Supervisor = sequelize.define(
    'supervisor',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      positionTitle: Sequelize.STRING,
    },
    { freezeTableName: true },
  );
  return Supervisor;
};
