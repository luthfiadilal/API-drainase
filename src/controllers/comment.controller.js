const db = require('../models');
const { DrainageReportComment, User } = db;
const socket = require('../socket');

exports.getCommentsByReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const comments = await DrainageReportComment.findAll({
      where: { report_id: reportId },
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'avatar_url', 'role']
        }
      ],
      order: [['created_at', 'ASC']]
    });

    res.json({
      status: 'success',
      data: comments
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { user_id, pseudonym, comment_text, parent_id } = req.body;
    let image_url = null;

    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }

    const newComment = await DrainageReportComment.create({
      report_id: reportId,
      user_id: user_id || null,
      pseudonym: user_id ? null : pseudonym,
      comment_text,
      image_url,
      parent_id: parent_id || null
    });

    // Fetch comment with user included to emit complete data to clients
    const commentWithUser = await DrainageReportComment.findByPk(newComment.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'avatar_url', 'role']
        }
      ]
    });

    // Emit event to room
    const io = socket.getIO();
    io.to(`report_${reportId}`).emit('new_comment', commentWithUser);

    res.status(201).json({
      status: 'success',
      data: commentWithUser
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};
