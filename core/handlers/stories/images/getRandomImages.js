const https = require('https');
const logger = require('@/utils/logger');

module.exports = (req, res) => {
  const { width = 300, height = 500 } = req.query;

  https.get(`https://random.imagecdn.app/v1/image?width=${width}&height=${height}`, (data) => {
    const { statusCode } = data;

    if (statusCode !== 200) {
      res.json({
        success: false,
        errorCode: 500,
        errorMessage: 'Failed to get image.',
      });
      return;
    }

    data.setEncoding('utf8');
    let rawData = '';
    data.on('data', (chunk) => { rawData += chunk; });
    data.on('end', () => {
      res.json({
        success: true,
        data: rawData,
      });
    });

    data.on('error', (e) => {
      logger.error(e.message);
      res.json({
        success: false,
        errorCode: 500,
        errorMessage: 'Failed to get image.',
      });
    });
  });
};
