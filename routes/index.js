const router = require('express').Router(); 
const expenseController = require('../controllers/expensereport-controller')

router.get('/', expenseController.showForm); 
router.post('/submitExpenses', expenseController.calculateExpenses)


module.exports = router; 