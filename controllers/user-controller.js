const User = require('../db').User;
const Team = require('../db').Team;
const Requisition = require('../db').Requisition;
const Report = require('../db').Report;

exports.editUser = async (req, res) => {
  let id = req.params.id;
  let aUser = await User.findByPk(id);
  let team = await Team.findByPk(aUser.teamId);
  let requisitions = await Requisition.findAll({
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
    flashes: req.flash('error'),
  });
};

exports.updateUser = async (req, res) => {
  let body = req.body;
  let user = await User.findByPk(body.id);
    
  if (Number.parseFloat(body.budget) < Number.parseFloat(user.totalEncumbered)) {
    req.flash(
      'error',
      'Cannot comply. User has encumbered more funds than intended budget.',
    );
    res.redirect('/teamProfile/' + user.teamId);
  } else {
    let team = await Team.findByPk(user.teamId);

    let budgetDif =
      Number.parseFloat(body.budget) - Number.parseFloat(user.budget);

    team.totalAllocated = Number.parseFloat(team.totalAllocated) + budgetDif;

    team.balance =
      Number.parseFloat(team.budget) - Number.parseFloat(team.totalAllocated);

    if (team.balance < 0) {
      req.flash(
        'error',
        'Not enough funds in Team Budget to allocate for User Budget.',
      );
      res.redirect('/editUser/' + body.id);
    } else {
      
      user.firstName = body.firstName;
      user.lastName = body.lastName;
      user.email = body.email;
      user.budget = body.budget;
      user.balance =
        Number.parseFloat(user.budget) - Number.parseFloat(user.totalSpent);
      await user.save();
      res.redirect('/teamProfile/' + user.teamId);
      await team.save();
    }
  }
};
