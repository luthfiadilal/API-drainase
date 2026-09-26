const db = require('../models');
const { Drainage, Region } = db;

exports.getAll = async (req, res) => {
  try {
    const { status, region_id } = req.query;
    let whereCondition = {};
    
    if (status) whereCondition.current_condition_status = status;
    if (region_id) whereCondition.region_id = region_id;

    const data = await Drainage.findAll({ 
        where: whereCondition,
        include: [{ model: Region }] 
    });
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getById = async (req, res) => {
  try {
    const data = await Drainage.findByPk(req.params.id, { include: [{ model: Region }] });
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const data = await Drainage.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const data = await Drainage.findByPk(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    await data.update(req.body);
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.delete = async (req, res) => {
  try {
    const data = await Drainage.findByPk(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    await data.destroy();
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};