const Requisition = require('../db').Requisition;
const Report = require('../db').Report;
const User = require('../db').User;

exports.showDash = async (req, res) => {
  let requisition = await Requisition.findAll({
    where: { userId: req.user.id },
    order: [['id', 'DESC']],
  });
  let report = await Report.findAll({
    where: { userId: req.user.id },
    order: [['requisitionId', 'ASC']],
  });

  res.render('user-dashboard', {
    requisition,
    report,
    flashSuccess: req.flash('success'),
    flashError: req.flash('error'),
  });
};

exports.addRequisition = (req, res) => {
  res.render('add-req', { flashes: req.flash('error') });
};

exports.submitRequisition = async (req, res) => {
  let user = await User.findByPk(req.user.id);
  let userBudget = Number.parseFloat(user.budget);
  let userBalance = Number.parseFloat(user.balance);

  reqObj = {
    id: Number.parseInt(req.body.id),
    encumbered: Number.parseFloat(req.body.encumbered),
    balance: Number.parseFloat(req.body.balance),
    totalSpent: Number.parseFloat(req.body.totalSpent),
    departureDate: req.body.departureDate,
    returnDate: req.body.returnDate,
    departLocation: req.body.departLocation,
    destination: req.body.destination,
    purpose: req.body.purpose,
    objectives: req.body.objectives,
  };

  reqObj.balance = reqObj.encumbered - reqObj.totalSpent;

  let userReqs = await Requisition.findAll({ where: { userId: req.user.id } });
  totalEncumbered = 0;
  for (let requisition of userReqs) {
    totalEncumbered =
      Number.parseFloat(totalEncumbered) +
      Number.parseFloat(requisition.encumbered);
  }
  totalEncumbered = totalEncumbered + reqObj.encumbered;
  console.log(
    '\n Total Encumbered when submitting Requisition: ' +
      totalEncumbered +
      '\n',
  );
  user.totalEncumbered = totalEncumbered;
  userBalance = userBudget - totalEncumbered;

  // expenseTotalDif =
  //   Number.parseFloat(previousExTotal) - newExpenses.expenseTotal;

  // balance = Number.parseFloat(balance) + expenseTotalDif;
  if (userBalance < 0) {
    req.flash(
      'error',
      'Not enough funds to encumber. Please contact your Team Supervisor.',
    );
    res.redirect('/');
  } else {
    reqObj.userId = req.user.id;
    await Requisition.upsert(reqObj);
    await user.save();

    res.redirect('/');
  }
};

exports.editRequisition = async (req, res) => {
  let id = req.params.id;
  let requisition = await Requisition.findByPk(id);
  res.render('edit-req', { requisition });
};

exports.deleteRequisition = async (req, res, next) => {
  let id = req.params.id;
  let requisitionId = null;
  let requisition = await Requisition.findByPk(id);
  let user = await User.findByPk(requisition.userId);

  user.totalEncumbered =
    Number.parseFloat(user.totalEncumbered) -
    Number.parseFloat(requisition.encumbered);
  await user.save();
  await Requisition.destroy({ where: { id } });
  await Report.destroy({ where: { requisitionId } });

  next();
};
