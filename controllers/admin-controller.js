const User = require('../db').User;
const Role = require('../db').Role;
const Team = require('../db').Team;
const Supervisor = require('../db').Supervisor;


exports.adminDash = async (req, res) => {
    let users = await User.findAll();
    res.render('admin', {users});
}

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
      },
      {
        model: Supervisor,
        as: 'supervisor',
        required: true,
      },
    ],
    order: [
      ['teamId', 'ASC'],
      ['supervisorId', 'DESC'],
      ['lastName', 'ASC'],
    ],
  });

  let roles = await Role.findAll();
  let teams = await Team.findAll();
  let supervisors = await Supervisor.findAll();

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

    user.supervisors = JSON.parse(JSON.stringify(supervisors));
    user.supervisors = user.supervisors.map(supervisor => {
      if (supervisor.id === user.supervisorId) {
        supervisor.selected = true;
      }

      return supervisor;
    });
    return user;
  });

  res.render('users', { users, teams, flashSuccess: req.flash('success'), });
};

exports.updateUsers = async (req, res) => {
  let body = req.body;

  for (let i = 0; i < body.users.length; i++) {
    let id = body.users[i].userId;
    let roleId = body.users[i].roleId;
    let teamId = body.users[i].teamId;
    let supervisorId = body.users[i].supervisorId;
    let user = await User.findByPk(id);

    user.roleId = roleId;
    user.teamId = teamId;
    user.supervisorId = supervisorId;
    await user.save();
  }
  
  req.flash('success', 'Successfully updated User(s).')
  res.redirect('/users');
};