const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ClassificationThreshold = sequelize.define('ClassificationThreshold', {
    category: { type: DataTypes.STRING(50), allowNull: false },
    min_score: { type: DataTypes.DECIMAL(5, 4), allowNull: false },
    max_score: { type: DataTypes.DECIMAL(5, 4), allowNull: false },
    action_recommendation: { type: DataTypes.TEXT, allowNull: true },
    color_hex: { type: DataTypes.STRING(10), defaultValue: '#28A745' },
  }, {
    tableName: 'classification_thresholds',
    timestamps: false
  });
  return ClassificationThreshold;
};