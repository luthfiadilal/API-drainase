const db = require('../models');
const { DrainageAction, DrainageActionImage, DrainageReport, DrainageReportItem, Drainage, IndicatorOption, Indicator, ClassificationThreshold, sequelize } = db;

exports.createAction = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    let { 
      report_id, 
      drainage_id, 
      action_title, 
      action_type, 
      description, 
      budget,
      options 
    } = req.body;
    
    const officer_user_id = req.user ? req.user.id : 1;

    if (typeof options === 'string') {
      try {
        options = JSON.parse(options);
      } catch (e) {
        options = options.split(',').map(item => parseInt(item.trim()));
      }
    }

    if (!options || !Array.isArray(options) || options.length === 0) {
      return res.status(400).json({ success: false, message: 'Harap pilih indikator untuk skor baru.' });
    }

    // Update old report to completed
    await DrainageReport.update({
      verification_status: 'completed',
      notes: sequelize.literal(`CONCAT(IFNULL(notes, ''), '\\n\\nTelah dilakukan perbaikan: ${action_title}')`)
    }, {
      where: { id: report_id },
      transaction: t
    });

    // Create Action
    const action = await DrainageAction.create({
      report_id,
      drainage_id,
      officer_user_id,
      action_title,
      action_type,
      start_date: new Date(),
      end_date: new Date(),
      budget: budget || 0,
      description: description || '',
      status: 'completed'
    }, { transaction: t });

    // Images will be saved later after newReport is created

    // --- Create New Report (to update score) ---
    const selectedOptions = await IndicatorOption.findAll({
      where: { id: options },
      include: [{ model: Indicator }],
      transaction: t
    });

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
    totalScore = parseFloat(totalScore.toFixed(4));

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

    const reportNumber = `RPT-ACT-${Date.now()}`;
    const newReport = await DrainageReport.create({
      report_number: reportNumber,
      drainage_id,
      reporter_name: 'Admin / Petugas',
      reporter_contact: 'Sistem',
      total_score: totalScore,
      status_result: statusResult,
      verification_status: 'verified',
      notes: `Laporan hasil perbaikan: ${action_title}`
    }, { transaction: t });

    const reportItems = selectedOptions.map(opt => ({
      report_id: newReport.id,
      indicator_id: opt.indicator_id,
      selected_score: opt.score,
      indicator_weight_snapshot: opt.Indicator ? opt.Indicator.weight : 0,
      calculated_value: opt.calculated_weight,
      notes: ''
    }));
    await DrainageReportItem.bulkCreate(reportItems, { transaction: t });

    // Update Drainage Master
    await Drainage.update({
      last_report_id: newReport.id,
      current_total_score: totalScore,
      current_condition_status: statusResult,
      current_pin_color: pinColor,
      last_assessed_at: new Date(),
      current_indicators_summary: summaryList
    }, {
      where: { id: drainage_id },
      transaction: t
    });

    // Create Images for both Action and the New Report
    if (req.files && req.files.length > 0) {
      const actionImages = req.files.map(file => ({
        action_id: action.id,
        image_type: 'after',
        image_url: `/uploads/${file.filename}`,
        caption: action_title
      }));
      await DrainageActionImage.bulkCreate(actionImages, { transaction: t });

      const { DrainageReportImage } = db;
      if (DrainageReportImage) {
        const reportImages = req.files.map(file => ({
          report_id: newReport.id,
          image_url: `/uploads/${file.filename}`,
          caption: `Perbaikan: ${action_title}`
        }));
        await DrainageReportImage.bulkCreate(reportImages, { transaction: t });
      }
    }

    await t.commit();
    res.status(201).json({ success: true, message: 'Perbaikan berhasil dicatat dan skor diperbarui.', data: action });
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
