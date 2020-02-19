const Sequelize = require('sequelize');  

const UserModel = require('./models/user');
// const RoleModel = require('./models/role');

const sequelize = new Sequelize(process.env.DATABASE_URL); 


const User = UserModel(sequelize, Sequelize); 
// const Role = RoleModel(sequelize, Sequelize);

// User.hasMany(Student);
// Student.belongsTo(User);
// Role.hasMany(User);
// User.belongsTo(Role);


sequelize.sync({ force: true })
    .then( () => console.log('\nTables are created.\n'))
    // .then( () => { return Role.bulkCreate([
    //     {id: 0, name: 'Blocked'},
    //     {id: 1, name: 'User'},
    //     {id: 2, name: 'Admin'}
    // ], { updateOnDuplicate: [ 'name' ] }) 
// }) 
    
  
module.exports = {
   
    User,
    // Role,
}

// sequelize.sync({ force: true }).then( () => console.log('\nTables are created.\n')); 
    // this is will delete your data completely in order to resync your table.
    // ideally create your database thoroughly otherwise will have to create migration files.
    