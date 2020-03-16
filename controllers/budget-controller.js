const User = require('../db').User;
const Requisition = require('../db').Requisition;

exports.updateUserBudget = async (req, res) => {
  let user = await User.findByPk(req.user.id);
  let userReqs = await Requisition.findAll({ where: { userId: req.user.id } });

  user.totalSpent = 0;
  for (let requisition of userReqs) {
    user.totalSpent =
      Number.parseFloat(user.totalSpent) +
      Number.parseFloat(requisition.totalSpent);
  }

  user.balance =
    Number.parseFloat(user.budget) - Number.parseFloat(user.totalSpent);

  await user.save();
  res.redirect('/');
};
