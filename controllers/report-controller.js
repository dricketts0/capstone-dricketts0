const Requisition = require('../db').Requisition;
const Report = require('../db').Report;
const Team = require('../db').Team;
const User = require('../db').User;

exports.addReport = async (req, res) => {
  let id = req.params.id;
  let requisition = await Requisition.findByPk(id);
  let team = await Team.findByPk(req.user.teamId);
  res.render('add-edit-rep', {
    requisition,
    team,
    flashes: req.flash('error'),
    isSupervisor: req.user.supervisorId === 1,
    isAdmin: req.user.roleId === 2,
  });
};

exports.submitExpenses = async (req, res, next) => {
  // ---- Prepping Expenses to Calculate Totals that will affect Budgets ---- //
  let expenses = {
    expenseTotal: req.body.expenseTotal,
    airfare: req.body.airfare,
    baggage: req.body.baggage,
    lodging: req.body.lodging,
    mileage: req.body.mileage,
    carRental: req.body.carRental,
    meals: req.body.meals,
    parking: req.body.parking,
    taxi: req.body.taxi,
  };

  // ---- Calculating Total of Expenses of Report ---- //
  for (let [key, value] of Object.entries(expenses)) {
    if (value == '') {
      value = 0;
    }
    expenses[key] = Number.parseFloat(value);
    expenses.expenseTotal += expenses[key];
  }

  ///-- Assigning Id Numbers to Expenses Object --///
  expenses.requisitionId = req.body.requisitionId;
  expenses.userId = req.user.id;

  // ---- Validating request to submit Expense Report and attach to Requisition  ---- //
  let requisition = await Requisition.findByPk(expenses.requisitionId);

  if (req.body.id !== '') {
    let prevReport = await Report.findByPk(req.body.id);
    let allReports = await Report.findAll({
      where: { requisitionId: expenses.requisitionId },
    });
    let prevExTotal = await prevReport.expenseTotal;
    expenses.id = req.body.id;

    console.log(requisition.totalSpent);

    let expenseTotalDif =
      Number.parseFloat(expenses.expenseTotal) - Number.parseFloat(prevExTotal);
    requisition.totalSpent = expenseTotalDif;

    for (let report of allReports) {
      requisition.totalSpent =
        Number.parseFloat(requisition.totalSpent) +
        Number.parseFloat(report.expenseTotal);
    }
    requisition.balance =
      Number.parseFloat(requisition.encumbered) - requisition.totalSpent;
  } else {
    requisition.totalSpent =
      Number.parseFloat(requisition.totalSpent) +
      Number.parseFloat(expenses.expenseTotal);
    requisition.balance =
      Number.parseFloat(requisition.encumbered) -
      Number.parseFloat(requisition.totalSpent);
  }

  if (requisition.balance < 0) {
    req.flash('error', 'Not enough funds in Requisition.');
    res.redirect('/addReport/' + expenses.requisitionId);
  } else {
    await Report.upsert(expenses);
    await requisition.save();

    next();
  }
};

exports.editReport = async (req, res) => {
  let id = req.params.id;
  let report = await Report.findByPk(id);
  let reqId = report.requisitionId;
  let requisition = await Requisition.findByPk(reqId);
  let team = await Team.findByPk(req.user.teamId);

  res.render('add-edit-rep', {
    report,
    requisition,
    team,
    flashes: req.flash('error'),
    isSupervisor: req.user.supervisorId === 1,
    isAdmin: req.user.roleId === 2,
  });
};

exports.deleteReport = async (req, res, next) => {
  let id = req.params.id;
  let report = await Report.findByPk(id);
  let requisition = await Requisition.findByPk(report.requisitionId);
  let user = await User.findByPk(report.userId);
  let team = await Team.findByPk(user.teamId);

  requisition.totalSpent =
    Number.parseFloat(requisition.totalSpent) -
    Number.parseFloat(report.expenseTotal);

  team.totalSpent =
    Number.parseFloat(team.totalSpent) - Number.parseFloat(report.expenseTotal);

  requisition.balance =
    Number.parseFloat(requisition.encumbered) -
    Number.parseFloat(requisition.totalSpent);

  await team.save();
  await requisition.save();
  await Report.destroy({ where: { id } });

  next();
};
