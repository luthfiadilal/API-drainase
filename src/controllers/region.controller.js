const db = require('../models');
const { Region } = db;

exports.getAllRegions = async (req, res) => {
  try {
    const [results] = await db.sequelize.query(`
      SELECT 
        region_id AS id, 
        region_name AS name, 
        risk_color, 
        risk_status,
        ST_AsGeoJSON(geom) AS geojson
      FROM region_risk_view
    `);

    const features = results.map(r => {
      const geojsonStr = r.geojson;
      return {
        type: "Feature",
        properties: { 
          id: r.id, 
          name: r.name,
          risk_color: r.risk_color,
          risk_status: r.risk_status
        },
        geometry: geojsonStr ? (typeof geojsonStr === 'string' ? JSON.parse(geojsonStr) : geojsonStr) : null
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