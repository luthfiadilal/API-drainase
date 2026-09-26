const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DrainageReportItem = sequelize.define('DrainageReportItem', {
    report_id: { type: DataTypes.INTEGER, allowNull: false },
    indicator_id: { type: DataTypes.INTEGER, allowNull: false },
    selected_score: { type: DataTypes.TINYINT, allowNull: false },
    indicator_weight_snapshot: { type: DataTypes.DECIMAL(5, 4), allowNull: false },
    calculated_value: { type: DataTypes.DECIMAL(6, 4), allowNull: false },
    notes: { type: DataTypes.STRING(255), allowNull: true },
  }, {
    tableName: 'drainage_report_items',
    timestamps: false
  });
  return DrainageReportItem;
};