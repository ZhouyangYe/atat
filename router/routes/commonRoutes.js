const { getFileInfo } = require('../../core/handlers/common');
const { COMMON_ROUTE } = require('../enum');
const { METHOD_TYPE } = require('../../core/enum');

const commonRoutes = {
  namespace: COMMON_ROUTE,
  apis: [
    {
      url: '/file/:path',
      method: METHOD_TYPE.GET,
      handler: getFileInfo,
    },
  ],
};

module.exports = { commonRoutes };
