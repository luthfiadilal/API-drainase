const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DrainageReportImage = sequelize.define('DrainageReportImage', {
    report_id: { type: DataTypes.INTEGER, allowNull: false },
    indicator_id: { type: DataTypes.INTEGER, allowNull: true },
    image_url: { type: DataTypes.STRING(255), allowNull: false },
    caption: { type: DataTypes.STRING(255), allowNull: true },
  }, {
    tableName: 'drainage_report_images',
    underscored: true,
    timestamps: true,
    updatedAt: false,
    createdAt: 'uploaded_at'
  });
  return DrainageReportImage;
};