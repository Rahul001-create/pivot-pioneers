/**
 * Application controller scaffold.
 */
exports.listApplications = async (_req, res) => {
  res.json({ mode: 'demo', applications: [] });
};

exports.createApplication = async (req, res) => {
  res.status(201).json({ mode: 'demo', application: req.body });
};

exports.updateApplicationStatus = async (req, res) => {
  res.json({ mode: 'demo', id: req.params.id, status: req.body.status });
};
