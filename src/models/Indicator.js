const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Indicator = sequelize.define('Indicator', {
    aspect_id: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING(200), allowNull: false },
    weight: { type: DataTypes.DECIMAL(5, 4), allowNull: false },
    order_number: { type: DataTypes.INTEGER, defaultValue: 1 },
  }, {
    tableName: 'indicators',
    underscored: true
  });
  return Indicator;
};