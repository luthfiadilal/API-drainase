const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DrainageAction = sequelize.define('DrainageAction', {
    report_id: { type: DataTypes.INTEGER, allowNull: false },
    drainage_id: { type: DataTypes.INTEGER, allowNull: false },
    officer_user_id: { type: DataTypes.INTEGER, allowNull: true },
    action_title: { type: DataTypes.STRING(150), allowNull: false },
    action_type: { type: DataTypes.ENUM('pembersihan_sampah', 'pengerukan_sedimen', 'perbaikan_dinding', 'pembuatan_tutup', 'pelebaran', 'normalisasi_total', 'lainnya'), allowNull: false },
    start_date: { type: DataTypes.DATEONLY, allowNull: true },
    end_date: { type: DataTypes.DATEONLY, allowNull: true },
    budget: { type: DataTypes.DECIMAL(15, 2), allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.ENUM('scheduled', 'in_progress', 'completed', 'cancelled'), defaultValue: 'scheduled' },
  }, {
    tableName: 'drainage_actions',
    underscored: true,
    timestamps: true,
    updatedAt: false,
  });
  return DrainageAction;
};