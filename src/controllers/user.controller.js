const db = require('../models');
const { User } = db;
const bcrypt = require('bcryptjs');

exports.getAll = async (req, res) => {
  try {
    const data = await User.findAll({ attributes: { exclude: ['password'] } });
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getById = async (req, res) => {
  try {
    const data = await User.findByPk(req.params.id, { attributes: { exclude: ['password'] } });
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const { password, email, ...otherData } = req.body;
    
    // Check duplicate email
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ success: false, message: 'Email already exists' });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const data = await User.create({ ...otherData, email, password: hashedPassword });
    
    // Remove password from response
    const dataJSON = data.toJSON();
    delete dataJSON.password;
    
    res.status(201).json({ success: true, data: dataJSON });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const data = await User.findByPk(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    
    const updateData = { ...req.body };
    
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }
    
    await data.update(updateData);
    
    const dataJSON = data.toJSON();
    delete dataJSON.password;
    
    res.json({ success: true, data: dataJSON });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ success: false, message: 'Email tidak terdaftar.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Password salah.' });

    const userJSON = user.toJSON();
    delete userJSON.password;

    res.json({ success: true, message: 'Login berhasil.', data: userJSON });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.delete = async (req, res) => {
  try {
    const data = await User.findByPk(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    await data.destroy();
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};