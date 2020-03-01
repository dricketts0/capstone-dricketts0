module.exports = (sequelize, Sequelize) => {
  let Report = sequelize.define(
    'report',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      airfare: Sequelize.DECIMAL(10, 2),
      baggage: Sequelize.DECIMAL(10, 2),
      lodging: Sequelize.DECIMAL(10, 2),
      meals: Sequelize.DECIMAL(10, 2),
      mileage: Sequelize.DECIMAL(10, 2),
      carRental: Sequelize.DECIMAL(10, 2),
      parking: Sequelize.DECIMAL(10, 2),
      taxi: Sequelize.DECIMAL(10, 2),
      expenseTotal: Sequelize.DECIMAL(10, 2),
    },
    { freezeTableName: true },
  );

  return Report;
};
