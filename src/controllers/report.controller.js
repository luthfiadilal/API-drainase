const db = require('../models');
const { DrainageReport, DrainageReportItem, Drainage, IndicatorOption, Indicator, Aspect, ClassificationThreshold, DrainageReportImage, sequelize } = db;
const { Op } = require('sequelize');

exports.createReport = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    let { drainage_id, reporter_name, reporter_contact, notes, options } = req.body;
    
    // Parse options if it was sent as a string (multipart/form-data)
    if (typeof options === 'string') {
      try {
        options = JSON.parse(options);
      } catch (e) {
        options = options.split(',').map(item => parseInt(item.trim()));
      }
    }

    // options should be an array of option IDs
    if (!options || !Array.isArray(options) || options.length === 0) {
      return res.status(400).json({ success: false, message: 'Harap pilih indikator.' });
    }

    // Fetch the selected options
    const selectedOptions = await IndicatorOption.findAll({
      where: { id: options },
      include: [{ model: Indicator }],
      transaction: t
    });

    if (selectedOptions.length === 0) {
      return res.status(400).json({ success: false, message: 'Opsi indikator tidak valid.' });
    }

    // Calculate total score
    let totalScore = 0;
    const summaryList = [];

    selectedOptions.forEach(opt => {
      totalScore += parseFloat(opt.calculated_weight);
      summaryList.push({
        indicator_id: opt.indicator_id,
        indicator_name: opt.Indicator ? opt.Indicator.name : '',
        score: opt.score,
        description: opt.description,
        calculated_weight: opt.calculated_weight
      });
    });

    // Bulatkan hingga 4 angka desimal untuk menghindari isu floating-point Javascript (e.g. 0.9999999999)
    totalScore = parseFloat(totalScore.toFixed(4));

    // Find classification status based on total score
    const thresholds = await ClassificationThreshold.findAll({ transaction: t });
    let statusResult = 'Clear';
    let pinColor = '#28A745';
    
    for (let th of thresholds) {
      const min = parseFloat(th.min_score);
      const max = parseFloat(th.max_score);
      if (totalScore >= min && totalScore <= max) {
        statusResult = th.category;
        pinColor = th.color_hex;
        break;
      }
    }

    // Create Report
    const reportNumber = `RPT-${Date.now()}`;
    const report = await DrainageReport.create({
      report_number: reportNumber,
      drainage_id,
      reporter_name: reporter_name || 'Citizen',
      reporter_contact: reporter_contact || '',
      total_score: totalScore,
      status_result: statusResult,
      notes: notes || ''
    }, { transaction: t });

    // Create Report Items
    const reportItems = selectedOptions.map(opt => ({
      report_id: report.id,
      indicator_id: opt.indicator_id,
      selected_score: opt.score,
      indicator_weight_snapshot: opt.Indicator ? opt.Indicator.weight : 0,
      calculated_value: opt.calculated_weight,
      notes: ''
    }));

    await DrainageReportItem.bulkCreate(reportItems, { transaction: t });

    // Create Report Images if any
    if (req.files && req.files.length > 0) {
      const reportImages = req.files.map(file => ({
        report_id: report.id,
        image_url: `/uploads/${file.filename}`,
        caption: notes ? notes.substring(0, 255) : ''
      }));
      if (DrainageReportImage) {
        await DrainageReportImage.bulkCreate(reportImages, { transaction: t });
      }
    }

    // Update Drainage Master Data
    await Drainage.update({
      last_report_id: report.id,
      current_total_score: totalScore,
      current_condition_status: statusResult,
      current_pin_color: pinColor,
      last_assessed_at: new Date(),
      current_indicators_summary: summaryList
    }, {
      where: { id: drainage_id },
      transaction: t
    });

    await t.commit();
    
    // Emit socket events
    try {
      const { getIO } = require('../socket');
      const io = getIO();
      const updatedDrainage = await Drainage.findByPk(drainage_id);
      
      // Emit new report to all users (citizens & admins)
      io.emit('new_report', {
        message: `Ada laporan baru di ${updatedDrainage ? updatedDrainage.name : 'Drainase'}`,
        drainageId: drainage_id,
        drainageName: updatedDrainage ? updatedDrainage.name : 'Drainase',
        statusResult,
        reportId: report.id
      });

      // Emit specific danger report if applicable
      if (statusResult === 'Danger' || statusResult === 'Bahaya' || statusResult === 'Waspada' || statusResult?.toLowerCase() === 'danger') {
        io.emit('danger_report', {
          message: `Laporan DANGER baru di ${updatedDrainage ? updatedDrainage.name : 'Drainase'}!`,
          drainageId: drainage_id,
          drainageName: updatedDrainage ? updatedDrainage.name : 'Drainase',
          reportId: report.id
        });
      }
    } catch (err) {
      console.error('Socket emit error:', err);
    }

    res.status(201).json({ success: true, message: 'Laporan berhasil disubmit.', data: report });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllReports = async (req, res) => {
  try {
    const { status } = req.query;
    let whereCondition = {};
    if (status) {
      whereCondition.status_result = status;
    }
    
    const reports = await DrainageReport.findAll({
      where: whereCondition,
      include: [
        { model: Drainage, attributes: ['id', 'name', 'code', 'address'] },
        { 
          model: DrainageReportItem, 
          include: [
            { 
              model: Indicator,
              include: [Aspect, IndicatorOption]
            }
          ] 
        },
        { model: DrainageReportImage }
      ],
      order: [['report_date', 'DESC']]
    });
    
    res.json({ success: true, data: reports });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
