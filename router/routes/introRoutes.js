const { introHandler, getIntroInfo, getResumeData } = require('../../core/handlers/intro');
const { METHOD_TYPE } = require('../../core/enum');

const introRoutes = {
  match: /^\/intro.*$/,
  handler: introHandler,
  namespace: 'intro',
  apis: [
    {
      url: '/info',
      method: METHOD_TYPE.GET,
      handler: getIntroInfo,
    },
    {
      url: '/resume',
      method: METHOD_TYPE.GET,
      handler: getResumeData,
    },
  ],
};

module.exports = { introRoutes };
