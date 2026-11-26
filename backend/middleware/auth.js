/**
 * Authentication and Role-Based Access Control middleware scaffold.
 * Replace header-based demo decoding with signed JWT verification in production.
 */
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication token required.' });
  }

  const token = authHeader.slice(7).trim();
  if (!token) {
    return res.status(401).json({ error: 'Invalid authentication token.' });
  }

  // Scaffold user payload for downstream controllers
  req.user = {
    id: req.headers['x-demo-user-id'] || 'demo-user',
    role: req.headers['x-demo-role'] || 'freelancer'
  };
  return next();
}

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Forbidden: requires role ${allowedRoles.join(' or ')}.`
      });
    }
    return next();
  };
}

module.exports = { requireAuth, requireRole };
