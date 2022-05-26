const logger = require('@/utils/logger');
const data1 = require('./mock');
const data2 = require('./mock2');

module.exports = (req, res) => {
  res.json({
    success: true,
    data: data1.data.map((d, i) => ({
      picture: {
        link: d.thumbURL,
        ratio: d.height / d.width,
      },
      desc: d.fromPageTitleEnc,
      id: i,
    })).filter((d) => !!d.picture.link),
  });
};
