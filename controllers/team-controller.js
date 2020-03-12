const Team = require('../db').Team;
const User = require('../db').User; 

//admin only, add/edit/delete team

// exports.addRelationship = (req, res) => {
  // const { teamId, userId } = req.body;
  // const team = await Team.findByPk(teamId);
  // await team.addUser(userId);
  // res.send(team);
// };

exports.listTeams = async (req, res) => {
let team = await Team.findAll(); 
res.render('teams', { team });
};

exports.addTeam = async (req, res) => {
  res.render('add-edit-team');
};

exports.editTeam = async (req, res) => {
  let id = req.params.id;
  let team = await Team.findByPk(id);

  res.render('add-edit-team', { team });
};

exports.submitTeam = async (req, res) => {
  await Team.upsert(req.body);
  res.redirect('/teams');
};

exports.deleteTeam = async (req, res) => {
  let id = req.params.id;
  await Team.destroy({ where: { id } });
  await User.update( { teamId: 1 }, { where: { teamId: null } });
  
  res.redirect('/teams');
}; 
