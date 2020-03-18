const User = require('../db').User;
const Requisition = require('../db').Requisition;
const Team = require('../db').Team;

exports.updateBudgets = async (req, res) => {
  let user = await User.findByPk(req.user.id);
  let userReqs = await Requisition.findAll({ where: { userId: req.user.id } });
  let team = await Team.findByPk(user.teamId);
  let teamReqs = await Requisition.findAll({ where: { teamId: user.teamId} });
  console.log(teamReqs);
  console.log('\nTeam Expenses (before): ' + team.totalSpent);
  user.totalSpent = 0;
  for (let requisition of userReqs) {
    user.totalSpent =
      Number.parseFloat(user.totalSpent) +
      Number.parseFloat(requisition.totalSpent);
      // console.log(user.totalSpent);
  }

  team.totalSpent = 0;
  for (let requisition of teamReqs) {
    team.totalSpent =
      Number.parseFloat(team.totalSpent) +
      Number.parseFloat(requisition.totalSpent);
      console.log(requisition);
  }
  console.log('\nUser Spent: ' + user.totalSpent);
  // team.totalSpent = Number.parseFloat(team.totalSpent) + user.totalSpent;
  console.log('\nTeam Expenses (after): ' + team.totalSpent);
  user.balance =
    Number.parseFloat(user.budget) - Number.parseFloat(user.totalSpent);

  await user.save();
  await team.save();
  res.redirect('/');
};
