const path = require('path');

function currencyUS(amount) {
    return new Intl.NumberFormat('en-US', 
     {style: 'currency', currency: 'USD'}
     ).format(amount);
};

exports.showDash = (req, res) => {
    res.render('user-dashboard')
}

// router.get('/expense-report', expenseController.reportPage);

exports.reportPage = (req, res) => {
    res.render('expense-report')
    // res.sendFile('/Users/dricketts/backend-class/capstone/capstone-dricketts0/public/exreport.html');

}

exports.calculateExpenses = (req, res) => {
    let expenses = req.body;   
    let expenseTotal = 0;
    
    for (let [key, value] of Object.entries(expenses)) {
        if (value == "") {
            value = 0;
        };
        let expense = Number.parseFloat(value);
        expenseTotal += expense;
    }
    
    expenseTotal = currencyUS(expenseTotal);

    res.render('user-dashboard', { expenseTotal });
}
