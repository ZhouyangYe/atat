const fs = require('fs');
const db = require('@/db');
const logger = require('@/utils/logger');
const { IMAGE_TYPE } = require('@/core/enum');

const introHandler = (req, res) => {
  res.html('intro');
};

const getIntroInfo = (req, res) => {
  let queryBackground, queryProfile;

  const backgroundSql = `SELECT path,name,orders FROM images WHERE type = '${IMAGE_TYPE.ALBUM}' AND picked = 1`;
  queryBackground = db.query(backgroundSql);

  const profileSql = `SELECT path,name,orders FROM images WHERE type = '${IMAGE_TYPE.PROFILE}' AND picked = 1`;
  queryProfile = db.query(profileSql);

  Promise.all([queryBackground, queryProfile]).then((values) => {
    const backgroundData = values[0];
    const profileData = values[1];

    res.json({
      data: {
        backgrounds: backgroundData,
        profile: profileData[0],
      },
      success: true,
    });
  }).catch((err) => {
    logger.error(err);
    res.json({
      success: false,
      errorCode: 500,
      errorMessage: 'Failed to get info!',
    });
  });
};

const getResumeData = (req, res) => {
  fs.readFile('resources/static/resume/resume.json', (err, data) => {
    if (err) {
      res.json({
        success: false,
      });
      return;
    }

    try {
      const resume = JSON.parse(data);

      res.json({
        success: true,
        data: resume,
      });

      // setTimeout(() => {
      //   res.json({
      //     success: true,
      //     data: resume,
      //   });
      // }, 3000);
      return;
    } catch (e) {
      res.json({
        success: false,
      });
    }
  });
};

module.exports = {
  introHandler,
  getIntroInfo,
  getResumeData,
};
