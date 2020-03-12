const User = require('../db').User;
const Budget = require('../db').Budget;
const Team = require('../db').Team;

// router.get('/addbudget', budgetController.addbudget);//authorizeRole([3]),
// // router.post(
//   '/submitbudget',
//   authorizeRole([3]),
//   budgetController.submitbudget,
// );
// router.get(
//   '/editbudget/:id',
//   authorizeRole([2, 3]),
//   budgetController.editbudget,
// ); //will change to [3] if create userbudget model

exports.addBudget = async (req, res) => {
  budgetId = req.params.id; 
  let team = await Team.findAll();
  res.render('add-edit-budget', { team, BudgetId});
};

exports.editBudget = async (req, res) => {
  let id = req.params.id;
  let budget = await Budget.findByPk(id);
  res.render('add-edit-budget', { budget });
}

exports.submitBudget = async (req, res, next) => {
  try {
    console.log(req.body)
    console.log(req.params.id)
    // await Budget.upsert(req.body);
    
    res.redirect('/users');
  } catch (error) {
    console.log(error);
  }
};
