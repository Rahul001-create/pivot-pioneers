/**
 * User & Profile controller scaffold.
 */
exports.getProfile = async (req, res) => {
  res.json({ mode: 'demo', id: req.params.id });
};

exports.updateProfile = async (req, res) => {
  res.json({ mode: 'demo', id: req.params.id, updates: req.body });
};
