const router = require('express').Router();
const expenseController = require('../controllers/expense-controller');
const reportController = require('../controllers/report-controller');
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
router.get('/editReq/:id', expenseController.editRequisition);
router.get('/deleteReq/:id', expenseController.deleteRequisition);
router.get('/addReport/:id', reportController.addReport);
router.post('/submitExpenses', reportController.calculateExpenses);
router.get('/editReport/:id', reportController.editReport);
router.post('/updateExpenses', reportController.updateExpenses);
router.get('/deleteReport/:id', reportController.deleteReport);
 
module.exports = router;
