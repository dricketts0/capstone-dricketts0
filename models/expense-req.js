module.exports = (sequelize, Sequelize) => {
  let Requisition = sequelize.define(
    'requisition',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      encumbered: {
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
      departureDate: Sequelize.STRING,
      returnDate: Sequelize.STRING,
      departLocation: Sequelize.STRING,
      destination: Sequelize.STRING,
      purpose: Sequelize.STRING,
      objectives: Sequelize.BLOB,
    },
    { freezeTableName: true },
  );

  return Requisition;
};
