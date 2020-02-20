const Report = require('../db').Report;
// const path = require('path');

function currencyUS(amount) {
    return new Intl.NumberFormat('en-US', 
     {style: 'currency', currency: 'USD'}
     ).format(amount);
};

exports.showDash = async (req, res) => {
    let reports = await Report.findAll({ where: { userId: req.user.id }})
    // console.log(reports)
    // console.log("can you se me?")
    res.render('user-dashboard', { reports: reports, flashes: req.flash('success')})
}

// router.get('/expense-report', expenseController.reportPage);

exports.reportPage = (req, res) => {
    res.render('expense-report')
    // res.sendFile('/Users/dricketts/backend-class/capstone/capstone-dricketts0/public/exreport.html');

}

exports.calculateExpenses = (req, res) => {
    req.body.userId = req.user.id; 
    // let expenses = req.body;   
    // let expenseTotal = 0;
    // let reports = Report.findAll({ where: { userId: req.user.id }, order: [['id', 'ASC']] })

    // for (let [key, value] of Object.entries(expenses)) {
    //     if (value == "") {
    //         value = 0;
    //     };
    //     let expense = Number.parseFloat(value);
    //     expenseTotal += expense;
    // }
    
    // expenseTotal = currencyUS(expenseTotal);

    Report.upsert(req.body);
    res.redirect('/');
}
