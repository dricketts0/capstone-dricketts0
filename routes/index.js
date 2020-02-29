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
router.get('/addReq', expenseController.addRequisition);
router.post('/submitReq', expenseController.submitRequisition);
router.get('/editReq/:id', expenseController.editRequisition)
router.get('/addReport/:id', expenseController.addReport);
router.post('/submitExpenses', expenseController.calculateExpenses);
 
module.exports = router;
