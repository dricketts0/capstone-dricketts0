const Requisition = require('../db').Requisition;
const Report = require('../db').Report;
const User = require('../db').User;

// function currencyUS(amount) {
//     return new Intl.NumberFormat('en-US',
//      {style: 'currency', currency: 'USD'}
//      ).format(amount);
// };

exports.showDash = async (req, res) => {
  let requisition = await Requisition.findAll({
    where: { userId: req.user.id },
  });
  let report = await Report.findAll({ where: { userId: req.user.id } });
  let user = await User.findAll({ where: { id: req.user.id } });
  res.render('user-dashboard', {
    user,
    requisition,
    report,
    flashes: req.flash('success'),
  });
};

exports.addRequisition = (req, res) => {
  res.render('add-edit-req');
};

exports.submitRequisition = async (req, res) => {
  req.body.userId = req.user.id;
  await Requisition.upsert(req.body);
  console.log(req.body);
  res.redirect('/');
};

exports.editRequisition = async (req, res) => {
  let id = req.params.id;
  let requisition = await Requisition.findByPk(id);
  res.render('add-edit-req', { requisition });
};

exports.addReport = async (req, res) => {
  try {
    let id = req.params.id;
    let requisition = await Requisition.findByPk(id);
    res.render('add-edit-rep', { requisition });
  } catch (error) {
    console.log(error);
  }
};

exports.calculateExpenses = async (req, res) => {
  let expenses = {
    expenseTotal: req.body.expenseTotal,
    airfare: req.body.airfare,
    baggage: req.body.baggage,
    carRental: req.body.carRental,
    lodging: req.body.lodging,
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

  console.log(expenses);

  await Report.upsert(expenses);
  res.redirect('/');
};
