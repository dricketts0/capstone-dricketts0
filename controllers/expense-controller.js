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
    order: [['id', 'DESC']],
  });
  let report = await Report.findAll({
    where: { userId: req.user.id },
    order: [['requisitionId', 'ASC']],
  });
  let user = await User.findAll({ where: { id: req.user.id } });
  res.render('user-dashboard', {
    user,
    requisition,
    report,
    flashes: req.flash('success'),
  });
};

exports.addRequisition = (req, res) => {
  res.render('add-req');
};

exports.submitRequisition = async (req, res) => {
  try {
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

  reqObj.userId = req.user.id;
  await Requisition.upsert(reqObj);
 
  res.redirect('/');
} catch(error) {
  console.log(error);
}
};

exports.editRequisition = async (req, res) => {
  let id = req.params.id;
  let requisition = await Requisition.findByPk(id);
  res.render('edit-req', { requisition });
};

exports.deleteRequisition = async (req, res) => {
  let id = req.params.id;
  let requisitionId = null;
  await Requisition.destroy({ where: { id } });
  await Report.destroy({ where: { requisitionId } })
  res.redirect('/')
}
