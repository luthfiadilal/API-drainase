const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const config = {
  host: process.env.DB_HOST || '127.0.0.1',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'si_drainase',
  port: process.env.DB_PORT || 3306,
  dialect: 'mysql',
  logging: false
};
const db = {};

let sequelize = new Sequelize(config.database, config.username, config.password, config);

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Setup relationships mapping
db.Drainage.belongsTo(db.Region, { foreignKey: 'region_id' });
db.Region.hasMany(db.Drainage, { foreignKey: 'region_id' });

db.DrainagePhysicalHistory.belongsTo(db.Drainage, { foreignKey: 'drainage_id' });
db.DrainagePhysicalHistory.belongsTo(db.DrainageAction, { foreignKey: 'action_id' });

db.Indicator.belongsTo(db.Aspect, { foreignKey: 'aspect_id' });
db.Aspect.hasMany(db.Indicator, { foreignKey: 'aspect_id' });

db.IndicatorOption.belongsTo(db.Indicator, { foreignKey: 'indicator_id' });
db.Indicator.hasMany(db.IndicatorOption, { foreignKey: 'indicator_id' });

db.DrainageReport.belongsTo(db.Drainage, { foreignKey: 'drainage_id' });
db.DrainageReport.belongsTo(db.User, { foreignKey: 'user_id', as: 'Reporter' });
db.DrainageReport.belongsTo(db.User, { foreignKey: 'verified_by_user_id', as: 'Verifier' });

db.DrainageReportItem.belongsTo(db.DrainageReport, { foreignKey: 'report_id' });
db.DrainageReport.hasMany(db.DrainageReportItem, { foreignKey: 'report_id' });

db.DrainageReportItem.belongsTo(db.Indicator, { foreignKey: 'indicator_id' });

db.DrainageReportImage.belongsTo(db.DrainageReport, { foreignKey: 'report_id' });
db.DrainageReport.hasMany(db.DrainageReportImage, { foreignKey: 'report_id' });

db.DrainageReportComment.belongsTo(db.DrainageReport, { foreignKey: 'report_id' });
db.DrainageReport.hasMany(db.DrainageReportComment, { foreignKey: 'report_id', as: 'Comments' });

db.DrainageReportComment.belongsTo(db.User, { foreignKey: 'user_id' });
db.User.hasMany(db.DrainageReportComment, { foreignKey: 'user_id' });

db.DrainageReportComment.hasMany(db.DrainageReportComment, { foreignKey: 'parent_id', as: 'Replies' });
db.DrainageReportComment.belongsTo(db.DrainageReportComment, { foreignKey: 'parent_id', as: 'Parent' });

db.DrainageAction.belongsTo(db.DrainageReport, { foreignKey: 'report_id' });
db.DrainageAction.belongsTo(db.Drainage, { foreignKey: 'drainage_id' });
db.DrainageAction.belongsTo(db.User, { foreignKey: 'officer_user_id', as: 'Officer' });

db.DrainageActionImage.belongsTo(db.DrainageAction, { foreignKey: 'action_id' });

db.DrainageReportLog.belongsTo(db.DrainageReport, { foreignKey: 'report_id' });
db.DrainageReportLog.belongsTo(db.User, { foreignKey: 'user_id' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;