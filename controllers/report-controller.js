const Requisition = require('../db').Requisition;
const Report = require('../db').Report;

exports.addReport = async (req, res) => {
  let id = req.params.id;
  let requisition = await Requisition.findByPk(id);
  res.render('add-rep', { requisition });
};

exports.calculateExpenses = async (req, res) => {
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

  for (let [key, value] of Object.entries(expenses)) {
    if (value == '') {
      value = 0;
    }
    expenses[key] = Number.parseFloat(value);
    expenses.expenseTotal += expenses[key];
  }
  expenses.requisitionId = req.body.requisitionId;
  expenses.userId = req.user.id;

  let requisition = await Requisition.findByPk(expenses.requisitionId);
  let encumbered = await requisition.encumbered;
  let totalSpent = await requisition.totalSpent;
  let balance = await requisition.balance;

  let newTotal = Number.parseFloat(totalSpent);
  newTotal = newTotal + Number.parseFloat(expenses.expenseTotal);

  let newBalance = Number.parseFloat(balance);
  newBalance = Number.parseFloat(encumbered) - newTotal;

  let updatedReqObj = {
    id: expenses.requisitionId,
    encumbered: encumbered,
    totalSpent: newTotal,
    balance: newBalance,
    departureDate: req.body.departureDate,
    returnDate: req.body.returnDate,
    departLocation: req.body.departLocation,
    destination: req.body.destination,
    purpose: req.body.purpose,
    objectives: req.body.objectives,
  };

  await Requisition.upsert(updatedReqObj);
  await Report.upsert(expenses);
  res.redirect('/');
};

exports.editReport = async (req, res) => {
  let id = req.params.id;
  let report = await Report.findByPk(id);
  let reqId = report.requisitionId;
  let requisition = await Requisition.findByPk(reqId);

  res.render('edit-rep', { report, requisition });
};

exports.updateExpenses = async (req, res) => {
  let id = req.body.id;
  let previousReport = await Report.findByPk(id);
  let requisition = await Requisition.findByPk(req.body.requisitionId);
  let encumbered = await requisition.encumbered;
  let balance = await requisition.balance;

  let previousExTotal = await previousReport.expenseTotal;

  let newExpenses = {
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

  for (let [key, value] of Object.entries(newExpenses)) {
    if (value == '') {
      value = 0;
    }
    newExpenses[key] = Number.parseFloat(value);
    newExpenses.expenseTotal += newExpenses[key];
  };

  expenseTotalDif = Number.parseFloat(previousExTotal) - newExpenses.expenseTotal;

  balance = Number.parseFloat(balance) + expenseTotalDif;

  newExpenses.requisitionId = req.body.requisitionId;
  newExpenses.userId = req.user.id;
  newExpenses.id = req.body.id;

  let updatedReqObj = {
    id: newExpenses.requisitionId,
    encumbered: encumbered,
    totalSpent: newExpenses.expenseTotal,
    balance: balance,
    departureDate: req.body.departureDate,
    returnDate: req.body.returnDate,
    departLocation: req.body.departLocation,
    destination: req.body.destination,
    purpose: req.body.purpose,
    objectives: req.body.objectives,
  };

  await Requisition.upsert(updatedReqObj);
  await Report.upsert(newExpenses);
  res.redirect('/');
};

exports.deleteReport = async (req, res) => {
  let id = req.params.id;
  let report = await Report.findByPk(id);
  let requisition = await Requisition.findByPk(report.requisitionId);
  let encumbered = await requisition.encumbered;
  let totalSpent = await requisition.totalSpent;
  let balance = await requisition.balance;

  let newTotal = Number.parseFloat(totalSpent);
  newTotal = newTotal - Number.parseFloat(report.expenseTotal);

  let newBalance = Number.parseFloat(balance);
  newBalance = Number.parseFloat(encumbered) - newTotal;

  let updatedReqObj = {
    id: report.requisitionId,
    encumbered: encumbered,
    totalSpent: newTotal,
    balance: newBalance,
  };

  await Requisition.upsert(updatedReqObj);

  await Report.destroy({ where: { id } });
  res.redirect('/');
};
