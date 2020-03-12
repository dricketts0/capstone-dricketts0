const User = require('../db').User;
const Role = require('../db').Role;
const Team = require('../db').Team;

exports.listUsers = async (req, res) => {
  let users = await User.findAll({
    include: [
      {
        model: Role,
        as: 'role',
        required: true,
      },
      {
          model: Team,
          as: 'team',
          required: true,
      }
    ],
    order: [['teamId', 'ASC'], ['lastName', 'ASC']],
  });

  let roles = await Role.findAll();
  let teams = await Team.findAll();
  
  users = users.map(user => {
    user.roles = JSON.parse(JSON.stringify(roles));
    user.roles = user.roles.map(role => {
      if (role.id === user.roleId) {
        role.selected = true;
      }
      
      return role;
    });
    
    user.teams = JSON.parse(JSON.stringify(teams));
    user.teams = user.teams.map(team => {
      if (team.id === user.teamId) {
        team.selected = true;
      }
      
      return team;
    });
    return user;
  });
  
  res.render('users', { users, teams });
};

exports.updateUsers = async (req, res) => {
  let body = req.body;
  
  for (let i = 0; i < body.users.length; i++) {
    let id = body.users[i].userId;
    let roleId = body.users[i].roleId;
    let teamId = body.users[i].teamId;
    let user = await User.findByPk(id);
    
    user.roleId = roleId;
    user.teamId = teamId;
    await user.save();
  }
  
  res.redirect('/users');
};

// exports.addRelationship = (req, res) => {
// const { teamId, userId } = req.body;
// const team = await Team.findByPk(teamId);
// await team.addUser(userId);
// res.send(team);

// };
