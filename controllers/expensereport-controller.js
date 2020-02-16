function currencyUS(amount) {
    return new Intl.NumberFormat('en-US', 
     {style: 'currency', currency: 'USD'}
     ).format(amount);
};


exports.showForm = (req, res) => {
    res.render('expense-report')
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
