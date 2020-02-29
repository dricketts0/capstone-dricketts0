module.exports = (sequelize, Sequelize) => {
  let Requisition = sequelize.define(
    'requisition',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      encumbered: Sequelize.STRING,
      totalSpent: Sequelize.STRING,
      balance: Sequelize.STRING,
    },
    { freezeTableName: true },
  );

  return Requisition;
};
