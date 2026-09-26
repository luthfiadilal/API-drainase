const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DrainageReport = sequelize.define('DrainageReport', {
    report_number: { type: DataTypes.STRING(50), allowNull: false },
    drainage_id: { type: DataTypes.INTEGER, allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: true },
    reporter_name: { type: DataTypes.STRING(100), allowNull: true },
    reporter_contact: { type: DataTypes.STRING(50), allowNull: true },
    report_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    total_score: { type: DataTypes.DECIMAL(6, 4), defaultValue: 0 },
    status_result: { type: DataTypes.STRING(50), allowNull: false },
    verification_status: { type: DataTypes.ENUM('pending', 'verified', 'rejected', 'in_progress', 'completed'), defaultValue: 'pending' },
    verified_by_user_id: { type: DataTypes.INTEGER, allowNull: true },
    verified_at: { type: DataTypes.DATE, allowNull: true },
    notes: { type: DataTypes.TEXT, allowNull: true },
  }, {
    tableName: 'drainage_reports',
    underscored: true,
    timestamps: true,
    updatedAt: false,
  });
  return DrainageReport;
};