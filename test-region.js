const db = require('./src/models');

async function test() {
  try {
    const regions = await db.Region.findAll({
      attributes: [
        'id', 
        'name',
        [db.sequelize.fn('ST_AsGeoJSON', db.sequelize.col('geom')), 'geojson']
      ]
    });
    console.log("Success, got", regions.length, "regions");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    process.exit(0);
  }
}

test();
