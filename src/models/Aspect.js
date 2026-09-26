const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Aspect = sequelize.define('Aspect', {
    name: { type: DataTypes.STRING(150), allowNull: false },
    weight: { type: DataTypes.DECIMAL(5, 4), allowNull: false },
    order_number: { type: DataTypes.INTEGER, defaultValue: 1 },
  }, {
    tableName: 'aspects',
    underscored: true
  });
  return Aspect;
};