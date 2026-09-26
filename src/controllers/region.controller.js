const db = require('../models');
const { Region } = db;

exports.getAllRegions = async (req, res) => {
  try {
    const regions = await Region.findAll({
      attributes: [
        'id', 
        'name',
        [db.sequelize.fn('ST_AsGeoJSON', db.sequelize.col('geom')), 'geojson']
      ]
    });

    const features = regions.map(r => {
      const geojsonStr = r.getDataValue('geojson');
      return {
        type: "Feature",
        properties: { id: r.id, name: r.name },
        geometry: geojsonStr ? JSON.parse(geojsonStr) : null
      };
    }).filter(f => f.geometry !== null);

    res.json({
      success: true,
      data: {
        type: "FeatureCollection",
        features: features
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};