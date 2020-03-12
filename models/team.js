module.exports = (sequelize, Sequelize) => {
  let Team = sequelize.define(
    'team',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      teamCode: Sequelize.STRING,
      teamName: Sequelize.STRING,
      budget: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      totalSpent: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      balance: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
    },
    { freezeTableName: true },
  );

  return Team;
};
