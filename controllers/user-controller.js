const User = require('../db').User;
const Team = require('../db').Team;
const Requisition = require('../db').Requisition;
const Report = require('../db').Report;

exports.editUser = async (req, res) => {
  let id = req.params.id;
  let aUser = await User.findByPk(id);
  let team = await Team.findByPk(aUser.teamId);
  let requisitions = await Requisition.findAll( {
    where: { userId: id },
    order: [['id', 'DESC']],
  });
  let report = await Report.findAll({
    where: { userId: id },
    order: [['requisitionId', 'ASC']],
  });

  res.render('edit-user', {
    isSupervisor: req.user.supervisorId === 1,
    team,
    aUser,
    id,
    requisitions,
    report,
    flashes: req.flash('error')
  });
};

exports.updateUser = async (req, res) => {
  let body = req.body;
  let user = await User.findByPk(body.id);
  // let team = await Team.findByPk(user.teamId);

  // let teamBudget = Number.parseFloat(team.budget);
  // teamBudget -= Number.parseFloat(body.budget);

  // let newTotal = Number.parseFloat(totalSpent);
  // newTotal = newTotal + Number.parseFloat(expenses.expenseTotal);

  // let newBalance = Number.parseFloat(balance);
  // newBalance = Number.parseFloat(encumbered) - newTotal;

  // if (teamBudget < 0) {
  //   req.flash(
  //     'error',
  //     'Not enough funds in Team Budget to encumber for User Budget.'
  //   );
  //   res.redirect('/editUser/' + body.id);
  // } else {
    // await User.upsert(req.body);
    user.firstName = body.firstName;
    user.lastName = body.lastName;
    user.email = body.email;
    user.budget = body.budget;
    user.balance = Number.parseFloat(user.budget) - Number.parseFloat(user.totalSpent);
    await user.save()
    // team.budget = teamBudget;
    // await team.save();
  // }

  res.redirect('/teamProfile/' + user.teamId);
};
