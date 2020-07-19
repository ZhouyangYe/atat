const db = require('@/db');
const logger = require('@/utils/logger');
const { IMAGE_TYPE } = require('@/core/enum');
const { deliverHtmlFile } = require('../utils');

const introHandler = (req, res) => {
  deliverHtmlFile('intro', res);
};

const getIntroInfo = (req, res) => {
  const sql = `SELECT path,name,orders FROM images WHERE type = '${IMAGE_TYPE.ALBUM}' AND picked = 1`;
  db.query(sql).then((result) => {
    const data = result.sort(
      (prev, next) => prev.orders - next.orders
    ).map(
      item => `${item.path}/${item.name}`
    );
    res.json({
      data,
      success: true,
    });
  }).catch(err => {
    logger.error(err);
    res.json({
      success: false,
      errorCode: 500,
      errorMessage: '获取图片失败！',
    });
  });
};

module.exports = {
  introHandler,
  getIntroInfo
};
