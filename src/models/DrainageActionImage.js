const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DrainageActionImage = sequelize.define('DrainageActionImage', {
    action_id: { type: DataTypes.INTEGER, allowNull: false },
    image_type: { type: DataTypes.ENUM('before', 'in_progress', 'after'), defaultValue: 'after' },
    image_url: { type: DataTypes.STRING(255), allowNull: false },
    caption: { type: DataTypes.STRING(255), allowNull: true },
  }, {
    tableName: 'drainage_action_images',
    underscored: true,
    timestamps: true,
    updatedAt: false,
    createdAt: 'uploaded_at'
  });
  return DrainageActionImage;
};