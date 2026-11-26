/**
 * Project controller scaffold for REST API parity with frontend store.
 */
exports.listProjects = async (_req, res) => {
  res.json({ mode: 'demo', projects: [], note: 'Connect MongoDB (DB_ENABLED=true) for persistent server storage.' });
};

exports.createProject = async (req, res) => {
  res.status(201).json({ mode: 'demo', project: req.body });
};

exports.updateProject = async (req, res) => {
  res.json({ mode: 'demo', id: req.params.id, updates: req.body });
};

exports.submitWork = async (req, res) => {
  res.json({ mode: 'demo', id: req.params.id, status: 'Submitted', submission: req.body });
};

exports.approveWork = async (req, res) => {
  res.json({ mode: 'demo', id: req.params.id, status: 'Completed' });
};
