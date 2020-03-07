const User = require('../db').User;
const Role = require('../db').Role;


exports.adminDash = async (req, res) => {
    let users = await User.findAll( {
        include: [
            { 
                model: Role,
                as: 'role',
                required: true,
            }
        ],
        order: [['username', 'ASC']] }
        //need teamId?
    );
    let roles = await Role.findAll();
    
    users = users.map(user => { 
        user.roles = JSON.parse(JSON.stringify(roles));
        user.roles = user.roles.map(role => {
            if (role.id === user.roleId) {
                role.selected = true;
            }
            return role;
        })
        return user;
    });
    res.render('admin', { users });


}

exports.updateRoles = async (req, res) => {
    console.log(req.body);
    for (let userId in req.body) {
        let roleId = req.body[userId];

        let user = await User.findByPk(userId);
        user.roleId = roleId;
        await user.save();
    }
    res.redirect('/admin')
}
