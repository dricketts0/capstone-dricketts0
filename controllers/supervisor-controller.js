const Supervisor = require('../db').Supervisor;
const User = require('../db').User;



// router.get('/supervisors', supervisorController.listSupervisors);
// router.get('/addSupervisor', supervisorController.addSupervisor);
// router.post('/submitSupervisor', supervisorController.submitSupervisor);
// router.get('/editSupervisor/:id', supervisorController.editSupervisor);
// router.get('/deleteSupervisor/:id', supervisorController.deleteSupervisor);


exports.listSupervisors = async (req, res) => {
let supervisor = await Supervisor.findAll(); 
res.render('supervisor', { supervisor });
};

exports.addSupervisor = async (req, res) => {
  res.render('add-edit-supervisor');
};

exports.editSupervisor = async (req, res) => {
  let id = req.params.id;
  let supervisor = await Supervisor.findByPk(id);

  res.render('add-edit-supervisor', { supervisor });
};

exports.submitSupervisor = async (req, res) => {
  await Supervisor.upsert(req.body);
  res.redirect('/supervisors');
};

exports.deleteSupervisor = async (req, res) => {
  let id = req.params.id;
  await Supervisor.destroy({ where: { id } });
  res.redirect('/supervisors');
};
