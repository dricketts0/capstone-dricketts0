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
router.use(authController.isUser);
router.get('/', expenseController.showDash);
router.get('/addReq', expenseController.addRequisition);
router.post('/submitReq', expenseController.submitRequisition);
router.get('/editReq/:id', expenseController.editRequisition);
router.get(
  '/deleteReq/:id',
  expenseController.deleteRequisition,
  budgetController.updateBudgets,
);

router.get('/addReport/:id', reportController.addReport);
router.post(
  '/submitExpenses',
  reportController.submitExpenses,
  budgetController.updateBudgets,
);
router.get('/editReport/:id', reportController.editReport);
router.get(
  '/deleteReport/:id',
  reportController.deleteReport,
  budgetController.updateBudgets,
);

router.get('/users', authorizedRole([2]), adminController.listUsers);
router.post('/updateUsers', authorizedRole([2]), adminController.updateUsers);
router.get('/editUser/:id', authorizedSupervisor([1]), userController.editUser);
router.post(
  '/updateUser',
  authorizedSupervisor([1]),
  userController.updateUser,
);

router.get('/teams', authorizedRole([2]), teamController.listTeams);
router.get(
  '/teamProfile/:id',
  authorizedSupervisor([1]),
  teamController.teamProfile,
);
router.get('/addTeam', authorizedRole([2]), teamController.addTeam);
router.post('/submitTeam', authorizedRole([2]), teamController.submitTeam);
router.get('/editTeam/:id', authorizedRole([2]), teamController.editTeam);
router.get('/deleteTeam/:id', authorizedRole([2]), teamController.deleteTeam);

function authorizedRole(roles) {
  return (req, res, next) => {
    if (roles.includes(req.user.roleId)) {
      return next();
    }
    res.redirect('/');
  };
}

function authorizedSupervisor(status) {
  return (req, res, next) => {
    if (status.includes(req.user.supervisorId) || authorizedRole([2])) {
      return next();
    }
    res.redirect('/');
  };
}

module.exports = router;
