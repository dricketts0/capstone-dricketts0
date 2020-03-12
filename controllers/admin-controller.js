const User = require('../db').User;
const Role = require('../db').Role;
const Team = require('../db').Team;



exports.adminDash = async (req, res) => {
    let users = await User.findAll();
    res.render('admin', {users});
}


exports.test = (req, res) => {
    console.log(req.body);
}
// exports.updateRoles = async (req, res) => {
//     console.log(req.body);
//     for (let userId in req.body) {
//         let roleId = req.body[userId];

//         let user = await User.findByPk(userId);
//         user.roleId = roleId;
//         await user.save();
//     }
//     res.redirect('/admin')
// }
