const User = require('../db').User;
const Role = require('../db').Role;
const Team = require('../db').Team;



exports.adminDash = async (req, res) => {
    let users = await User.findAll();
    res.render('admin', {users});
}