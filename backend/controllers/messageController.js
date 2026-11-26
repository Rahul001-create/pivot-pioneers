/**
 * Messaging controller scaffold (ready for Socket.IO room broadcasts).
 */
exports.listConversations = async (_req, res) => {
  res.json({ mode: 'demo', conversations: [] });
};

exports.sendMessage = async (req, res) => {
  // Future Socket.IO emit hook: io.to(req.body.conversationId).emit('message:new', message)
  res.status(201).json({ mode: 'demo', message: req.body });
};
