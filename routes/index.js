const router = require('express').Router(); 
const expenseController = require('../controllers/expensereport-controller')
const authController = require('../controllers/auth-controller');
const passport = require('passport');



router.get('/register', authController.registerPage);
router.post('/register', authController.registerUser, authController.loginUser);
router.get('/login', authController.loginPage);
router.post('/login', authController.loginUser);
router.get('/logout', authController.logoutUser);

router.use(authController.isLoggedIn);
router.get('/', expenseController.showDash); 
router.post('/submitExpenses', expenseController.calculateExpenses);
router.get('/expense-report', expenseController.reportPage);


module.exports = router; 