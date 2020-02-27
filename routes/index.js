const router = require('express').Router();
const expenseController = require('../controllers/expense-controller');
const authController = require('../controllers/auth-controller');

router.get('/register', authController.registerPage);
router.post('/register', authController.registerUser, authController.loginUser);
router.get('/login', authController.loginPage);
router.post('/login', authController.loginUser);
router.get('/logout', authController.logoutUser);

router.use(authController.isLoggedIn);
router.get('/', expenseController.showDash);
router.get('/expense-req', expenseController.reqPage);
router.post('/submitReq', expenseController.addRequisition);
router.get('/expense-report', expenseController.reportPage);
router.post('/submitExpenses', expenseController.calculateExpenses);

module.exports = router;
