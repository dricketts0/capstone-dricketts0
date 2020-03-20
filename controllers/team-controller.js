const Team = require('../db').Team;
const User = require('../db').User;

exports.listTeams = async (req, res) => {
  let team = await Team.findAll();
  res.render('teams', {
    team,
    isSupervisor: req.user.supervisorId === 1,
    isAdmin: req.user.roleId === 2,
  });
};

exports.teamProfile = async (req, res) => {
  let id = req.params.id;
  let team = await Team.findByPk(id);
  let teamUsers = await User.findAll({ where: { teamId: id } });
  res.render('team-profile', {
    team,
    teamUsers,
    flashes: req.flash('error'),
    isSupervisor: req.user.supervisorId === 1,
    isAdmin: req.user.roleId === 2,
  });
};

exports.addTeam = async (req, res) => {
  res.render('add-edit-team', {
    isSupervisor: req.user.supervisorId === 1,
    isAdmin: req.user.roleId === 2,
  });
};

exports.editTeam = async (req, res) => {
  let id = req.params.id;
  let team = await Team.findByPk(id);

  res.render('add-edit-team', {
    team,
    isSupervisor: req.user.supervisorId === 1,
    isAdmin: req.user.roleId === 2,
  });
};

exports.submitTeam = async (req, res) => {
  await Team.upsert(req.body);
  res.redirect('/teams');
};

exports.deleteTeam = async (req, res) => {
  let id = req.params.id;
  await Team.destroy({ where: { id } });
  await User.update({ teamId: 1 }, { where: { teamId: null } });

  res.redirect('/teams');
};
