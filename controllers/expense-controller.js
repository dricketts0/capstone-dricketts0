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
    isSupervisor: req.user.supervisorId === 1,
    isAdmin: req.user.roleId === 2,
    requisition,
    report,
    flashSuccess: req.flash('success'),
    flashError: req.flash('error'),
  });
};

exports.addRequisition = (req, res) => {
  res.render('add-edit-req', {
    flashes: req.flash('error'),
    isSupervisor: req.user.supervisorId === 1,
    isAdmin: req.user.roleId === 2,
  });
};

exports.submitRequisition = async (req, res) => {
  if (req.body.encumbered < req.body.totalSpent) {
    req.flash('error', 'Cannot Encumber less than what is spent.');
    res.redirect('/');
  } else {
    let user = await User.findByPk(req.user.id);
    let budgetCheck = Number.parseFloat(user.budget);
    let balanceCheck = Number.parseFloat(user.balance);

    reqObj = {
      encumbered: Number.parseFloat(req.body.encumbered),
      totalSpent: Number.parseFloat(req.body.totalSpent),
      departureDate: req.body.departureDate,
      returnDate: req.body.returnDate,
      departLocation: req.body.departLocation,
      destination: req.body.destination,
      purpose: req.body.purpose,
      objectives: req.body.objectives,
    };

    if (req.body.encumbered == '') {
      reqObj.encumbered = 0;
    }

    if (req.body.totalSpent == '') {
      reqObj.totalSpent = 0;
      reqObj.balance = reqObj.encumbered - reqObj.totalSpent;
      user.totalEncumbered =
        Number.parseFloat(user.totalEncumbered) + reqObj.encumbered;
    } else if (req.body.id !== '') {
      let id = req.body.id;
      let prevReq = await Requisition.findByPk(id);
      reqObj.id = id;

      let encumbDif = Number.parseFloat(prevReq.encumbered) - reqObj.encumbered;
      reqObj.balance = Number.parseFloat(req.body.balance) - encumbDif;
      user.totalEncumbered =
        Number.parseFloat(user.totalEncumbered) - encumbDif;
    }

    balanceCheck = budgetCheck - Number.parseFloat(user.totalEncumbered);

    if (balanceCheck < 0) {
      req.flash(
        'error',
        'Not enough funds to encumber. Please contact your Team Supervisor.',
      );
      res.redirect('/');
    } else {
      reqObj.userId = req.user.id;
      reqObj.teamId = req.user.teamId;
      await Requisition.upsert(reqObj);
      await user.save();

      res.redirect('/');
    }
  }
};

exports.editRequisition = async (req, res) => {
  let id = req.params.id;
  let requisition = await Requisition.findByPk(id);
  res.render('add-edit-req', {
    requisition,
    isSupervisor: req.user.supervisorId === 1,
    isAdmin: req.user.roleId === 2,
  });
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
