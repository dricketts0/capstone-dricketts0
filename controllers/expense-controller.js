const Requisition = require('../db').Requisition
const Report = require('../db').Report;
const User = require('../db').User;

function currencyUS(amount) {
    return new Intl.NumberFormat('en-US', 
     {style: 'currency', currency: 'USD'}
     ).format(amount);
};

exports.showDash = async (req, res) => {
    let reports = await Report.findAll({ where: { id: req.user.id }})
    let user = await User.findAll({ where: { id: req.user.id }})
    res.render('user-dashboard', { user, reports, flashes: req.flash('success')})
}

exports.reqPage = (req,res) => {
    res.render('expense-req')
}

exports.addRequisition = async (req, res) => {
    req.body.userId = req.user.id; 
    await Requisition.upsert(req.body);
    console.log(req.body);
    res.redirect('/');
}

exports.reportPage = (req, res) => {
    res.render('expense-report')
}

exports.calculateExpenses = async (req, res) => {

    let expenses = {
        expenseTotal: req.body.expenseTotal,
        airfare: req.body.airfare,
        baggage: req.body.baggage,
        carRental: req.body.carRental,
        lodging: req.body.lodging,
        meals: req.body.meals,
        parking: req.body.parking,
        taxi: req.body.taxi,
    };
    
    for (let [key, value] of Object.entries(expenses)) {
        if (value == "") {
            value = 0;
        }
        
        // expenses[key] = currencyUS(value);
        expenses[key] = Number.parseFloat(value);
        expenses.expenseTotal += expenses[key];
    };

    expenses.userId = req.user.id;
 
    await Report.upsert(expenses);
    res.redirect('/');
}