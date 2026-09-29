const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Drainage = sequelize.define(
    "Drainage",
    {
      region_id: { type: DataTypes.INTEGER, allowNull: false },
      code: { type: DataTypes.STRING(50), allowNull: false },
      name: { type: DataTypes.STRING(150), allowNull: false },
      address: { type: DataTypes.TEXT, allowNull: true },
      latitude: { type: DataTypes.DECIMAL(10, 8), allowNull: false },
      longitude: { type: DataTypes.DECIMAL(11, 8), allowNull: false },
      last_report_id: { type: DataTypes.INTEGER, allowNull: true },
      current_total_score: { type: DataTypes.DECIMAL(7, 4), allowNull: true },
      current_condition_status: {
        type: DataTypes.ENUM("Clear", "Warning", "Danger"),
        allowNull: true,
      },
      current_pin_color: {
        type: DataTypes.STRING(10),
        defaultValue: "#6C757D",
      },
      last_assessed_at: { type: DataTypes.DATE, allowNull: true },
      current_indicators_summary: { type: DataTypes.JSON, allowNull: true },
    },
    {
      tableName: "drainages",
      underscored: true,
    },
  );
  return Drainage;
};
