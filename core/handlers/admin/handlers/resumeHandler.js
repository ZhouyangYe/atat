const fs = require('fs');
const logger = require('@/utils/logger');

const update = (obj1, obj2) => {
  if (!obj2 || typeof obj1 !== typeof obj2) {
    return;
  }

  Object.keys(obj1).forEach((key) => {
    if (Array.isArray(obj1[key])) {
      if (Array.isArray(obj2[key])) obj1[key] = obj2[key];
      return;
    }

    if (typeof obj1[key] === 'object') {
      update(obj1[key], obj2[key]);
      return;
    }

    if (obj2[key]) obj1[key] = obj2[key];
  });
};

const updateResume = (resume, newResume) => {
  return new Promise((res, rej) => {
    if (!newResume) {
      rej();
      return;
    }

    update(resume, newResume);
    fs.writeFile('resources/static/resume/resume.json', JSON.stringify(resume), (err) => {
      if (err) {
        logger.error(err);
        rej();
        return;
      }

      res();
    });
  });
};

module.exports = (req, res) => {
  fs.readFile('resources/static/resume/resume.json', 'utf-8', (err, data) => {
    if (err) {
      res.json({
        success: false,
        error: 500,
        errorMessage: `Can't find resume.`,
      });
      return;
    }

    const resume = JSON.parse(data), newResume = req.body && req.body.resume;

    updateResume(resume, newResume).then(() => {
      res.json({
        success: true,
      });
    }).catch((e) => {
      logger.error(e);
      res.json({
        success: false,
      });
    });
  });
};
