const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Region = sequelize.define('Region', {
    name: { type: DataTypes.STRING(100), allowNull: false },
    code: { type: DataTypes.STRING(20), allowNull: true },
    geom: { type: DataTypes.GEOMETRY('MULTIPOLYGON'), allowNull: false },
  }, {
    tableName: 'regions',
    underscored: true,
    timestamps: true,
    updatedAt: false,
  });
  return Region;
};