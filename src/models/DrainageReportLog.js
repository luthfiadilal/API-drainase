const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DrainageReportLog = sequelize.define('DrainageReportLog', {
    report_id: { type: DataTypes.INTEGER, allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: true },
    previous_status: { type: DataTypes.STRING(50), allowNull: true },
    new_status: { type: DataTypes.STRING(50), allowNull: false },
    remarks: { type: DataTypes.STRING(255), allowNull: true },
  }, {
    tableName: 'drainage_report_logs',
    underscored: true,
    timestamps: true,
    updatedAt: false,
  });
  return DrainageReportLog;
};