const db = require('../models');
const { Aspect, Indicator, IndicatorOption } = db;

exports.getAll = async (req, res) => {
  try {
    // Nested includes to fetch the whole SPK tree in one go
    const data = await Aspect.findAll({
        include: [{
            model: Indicator,
            include: [IndicatorOption]
        }],
        order: [['order_number', 'ASC'], [db.Indicator, 'order_number', 'ASC']]
    });
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const data = await Aspect.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const data = await Aspect.findByPk(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    await data.update(req.body);
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.delete = async (req, res) => {
  try {
    const data = await Aspect.findByPk(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    await data.destroy();
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};