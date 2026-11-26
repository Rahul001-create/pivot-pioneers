/**
 * Auth controller scaffold.
 * In local demo mode, frontend authentication uses localStorage.
 * Connect to User model + bcrypt + JWT when DB_ENABLED=true.
 */
exports.login = async (req, res) => {
  const { email, role } = req.body;
  if (!email || !role) {
    return res.status(400).json({ error: 'Email and role are required.' });
  }
  return res.json({
    mode: 'demo',
    user: { email, role },
    token: 'demo-jwt-placeholder'
  });
};

exports.signup = async (req, res) => {
  const { fullName, email, role } = req.body;
  if (!fullName || !email || !role) {
    return res.status(400).json({ error: 'Full name, email, and role are required.' });
  }
  return res.status(201).json({
    mode: 'demo',
    user: { fullName, email, role },
    token: 'demo-jwt-placeholder'
  });
};
