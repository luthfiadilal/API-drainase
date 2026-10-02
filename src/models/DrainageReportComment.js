module.exports = (sequelize, DataTypes) => {
  const DrainageReportComment = sequelize.define('DrainageReportComment', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    report_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    pseudonym: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    comment_text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    parent_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    tableName: 'drainage_report_comments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false // because there's no updated_at column in schema
  });

  return DrainageReportComment;
};
