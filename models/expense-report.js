module.exports = (sequelize, Sequelize) => {
    let Report = sequelize.define('report', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        airfare: Sequelize.TEXT,
        baggage: Sequelize.TEXT, 
        carRental: Sequelize.TEXT,
        lodging: Sequelize.TEXT,
        meals: Sequelize.TEXT,
        parking: Sequelize.TEXT,
        taxi: Sequelize.TEXT,
        expenseTotal: Sequelize.DECIMAL(10,2),
    }, { freezeTableName: true });

    return Report;
}