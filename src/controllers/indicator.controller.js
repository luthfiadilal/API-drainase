const db = require('../models');
const { Indicator, Aspect, IndicatorOption } = db;

exports.getAll = async (req, res) => {
  try {
    const data = await Indicator.findAll({
      include: [
        { model: Aspect, attributes: ['id', 'name', 'weight'] },
        { model: IndicatorOption }
      ],
      order: [['aspect_id', 'ASC'], ['order_number', 'ASC']]
    });
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getById = async (req, res) => {
  try {
    const data = await Indicator.findByPk(req.params.id, {
      include: [Aspect, IndicatorOption]
    });
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const { aspect_id } = req.body;
    const aspect = await Aspect.findByPk(aspect_id);
    if (!aspect) return res.status(400).json({ success: false, message: 'Aspect ID not found' });
    
    const data = await Indicator.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const data = await Indicator.findByPk(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    await data.update(req.body);
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.delete = async (req, res) => {
  try {
    const data = await Indicator.findByPk(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    await data.destroy();
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};