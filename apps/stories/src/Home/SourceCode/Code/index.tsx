import React from 'react';

import './index.less';

interface Params {
  ext: string;
  data: string;
}

const Code: React.FC<Params> = ({ ext, data }) => {
  return (
    <pre className={`atat-code`}>
      {data}
    </pre>
  );
};

export default Code;
