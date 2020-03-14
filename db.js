const Sequelize = require('sequelize');
const TeamModel = require('./models/team');
const UserModel = require('./models/user');
const RoleModel = require('./models/role');
const SupervisorModel = require('./models/supervisor')
const ReportModel = require('./models/expense-report');
const ReqModel = require('./models/expense-req');
const sequelize = new Sequelize(process.env.DATABASE_URL);

const Team = TeamModel(sequelize, Sequelize);
const User = UserModel(sequelize, Sequelize);
const Role = RoleModel(sequelize, Sequelize);
const Supervisor = SupervisorModel(sequelize, Sequelize);
const Report = ReportModel(sequelize, Sequelize);
const Requisition = ReqModel(sequelize, Sequelize);

// Team.belongsToMany(User, { through: 'TeamUser'});
// User.belongsToMany(Team, { through: 'TeamUser'});
Team.hasMany(User);
User.belongsTo(Team);
// Team.hasMany(Supervisor);
// Supervisor.belongsTo(Team);

// User.hasMany(Supervisor);
// Supervisor.belongsTo(User);
User.hasMany(Report);
Report.belongsTo(User);
User.hasMany(Requisition);
Requisition.belongsTo(User);

Requisition.hasMany(Report);
Report.belongsTo(Requisition);

Role.hasMany(User);
User.belongsTo(Role);
Supervisor.hasMany(User);
User.belongsTo(Supervisor)

sequelize
  .sync({ force: true })
  .then(() => console.log('\nTables are created.\n'))
  .then(() => {
    return Role.bulkCreate(
      [
        { id: 0, name: 'Blocked' },
        { id: 1, name: 'User' },
        { id: 2, name: 'Admin' },
      ],
      { updateOnDuplicate: ['name'] },
    );
  })
  .then(() => {
    return Team.create(
      { teamCode: '0000', teamName: 'Need Assignment' }
    )
  })
  .then(() => {
    return Supervisor.bulkCreate(
      [
        { id: 0, positionTitle: 'None'},
        { id: 1, positionTitle: 'Supervisor'},
      ], 
      { updateOnDuplicate: ['positionTitle'] },
    );
  })

module.exports = {
  User,
  Requisition,
  Report,
  Role,
  Team,
  Supervisor,
};
