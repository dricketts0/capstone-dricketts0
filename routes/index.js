const router = require('express').Router();
const expenseController = require('../controllers/expense-controller');
const reportController = require('../controllers/report-controller');
const authController = require('../controllers/auth-controller');
const adminController = require('../controllers/admin-controller');
const teamController = require('../controllers/team-controller');
const budgetController = require('../controllers/budget-controller');
const userController = require('../controllers/user-controller');

router.get('/register', authController.registerPage);
router.post('/register', authController.registerUser, authController.loginUser);
router.get('/login', authController.loginPage);
router.post('/login', authController.loginUser);
router.get('/logout', authController.logoutUser);

router.use(authController.isLoggedIn);
router.get('/', expenseController.showDash);
router.get('/addReq', expenseController.addRequisition);
router.post('/submitReq', expenseController.submitRequisition);
router.get('/editReq/:id', expenseController.editRequisition);
router.get('/deleteReq/:id', expenseController.deleteRequisition, budgetController.updateBudgets);

router.get('/addReport/:id', reportController.addReport);
router.post('/submitExpenses', reportController.submitExpenses, budgetController.updateBudgets);
router.get('/editReport/:id', reportController.editReport);
router.get('/deleteReport/:id', reportController.deleteReport, budgetController.updateBudgets);

//router.use(adminController.isAdmin)
router.get('/admin', adminController.adminDash);//authorizeRole([3])

router.get('/users', adminController.listUsers);
router.post('/updateUsers', adminController.updateUsers);//authorizeRole([3]), 
router.get('/editUser/:id', userController.editUser);
router.post('/updateUser', userController.updateUser);
//will change to [3] if create userbudget model

router.get('/teams', teamController.listTeams);
router.get('/teamProfile/:id', teamController.teamProfile); 
router.get('/addTeam', teamController.addTeam);
router.post('/submitTeam', teamController.submitTeam);
router.get('/editTeam/:id', teamController.editTeam);
router.get('/deleteTeam/:id', teamController.deleteTeam);

function authorizeRole(roles) {
  return (req, res, next) => {
    if (roles.includes(req.user.roleId)) {
      return next();
    }
    res.redirect('/');
    //res.status(401).send();
  };
}

module.exports = router;
