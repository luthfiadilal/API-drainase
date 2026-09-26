const db = require('../models');
const { IndicatorOption, Indicator } = db;

exports.getAll = async (req, res) => {
  try {
    const data = await IndicatorOption.findAll({
      include: [{ model: Indicator, attributes: ['id', 'name', 'weight'] }],
      order: [['indicator_id', 'ASC'], ['score', 'DESC']]
    });
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getById = async (req, res) => {
  try {
    const data = await IndicatorOption.findByPk(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const { indicator_id } = req.body;
    const indicator = await Indicator.findByPk(indicator_id);
    if (!indicator) return res.status(400).json({ success: false, message: 'Indicator ID not found' });
    
    const data = await IndicatorOption.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const data = await IndicatorOption.findByPk(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    await data.update(req.body);
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.delete = async (req, res) => {
  try {
    const data = await IndicatorOption.findByPk(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    await data.destroy();
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};