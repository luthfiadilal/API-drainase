const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const IndicatorOption = sequelize.define('IndicatorOption', {
    indicator_id: { type: DataTypes.INTEGER, allowNull: false },
    score: { type: DataTypes.TINYINT, allowNull: false },
    description: { type: DataTypes.STRING(255), allowNull: false },
    calculated_weight: { type: DataTypes.DECIMAL(5, 4), allowNull: false },
  }, {
    tableName: 'indicator_options',
    underscored: true,
    timestamps: true,
    updatedAt: false,
  });
  return IndicatorOption;
};