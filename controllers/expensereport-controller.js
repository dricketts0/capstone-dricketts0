const Report = require('../db').Report;

// function currencyUS(amount) {
//     return new Intl.NumberFormat('en-US', 
//      {style: 'currency', currency: 'USD'}
//      ).format(amount);
// };

exports.showDash = async (req, res) => {
    let reports = await Report.findAll({ where: { userId: req.user.id }})
    res.render('user-dashboard', { reports: reports, flashes: req.flash('success')})
}

exports.reportPage = (req, res) => {
    res.render('expense-report')
}

exports.calculateExpenses = async (req, res) => {
    req.body.userId = req.user.id; 
    
    let expenses = {
    airfare: req.body.airfare,
    baggage: req.body.baggage,
    carRental: req.body.carRental,
    lodging: req.body.lodging,
    meals: req.body.meals,
    parking: req.body.parking,
    taxi: req.body.taxi,
    };

    req.body.expenseTotal = 0;

    for (let [key, value] of Object.entries(expenses)) {
        if (value == "") {
            value = 0;
        }
        let expense = Number.parseFloat(value);
        req.body.expenseTotal += expense ;
        
    }
        
    await Report.upsert(req.body);
    res.redirect('/');
}
