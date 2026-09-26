const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DrainagePhysicalHistory = sequelize.define('DrainagePhysicalHistory', {
    drainage_id: { type: DataTypes.INTEGER, allowNull: false },
    action_id: { type: DataTypes.INTEGER, allowNull: true },
    channel_type: { type: DataTypes.ENUM('primer', 'sekunder', 'tersier'), defaultValue: 'tersier' },
    construction_type: { type: DataTypes.ENUM('beton_precast', 'pasangan_batu', 'tanah', 'pipa', 'lainnya'), defaultValue: 'beton_precast' },
    width_meters: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
    depth_meters: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
    length_meters: { type: DataTypes.DECIMAL(8, 2), allowNull: true },
    condition_note: { type: DataTypes.TEXT, allowNull: true },
    recorded_date: { type: DataTypes.DATEONLY, allowNull: false },
  }, {
    tableName: 'drainage_physical_histories',
    underscored: true,
    timestamps: true,
    updatedAt: false,
  });
  return DrainagePhysicalHistory;
};