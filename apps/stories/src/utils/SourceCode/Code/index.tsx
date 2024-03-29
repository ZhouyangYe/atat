import hljs from 'highlight.js';
import { EXT } from 'atat-common/lib/utils';
import React, { useLayoutEffect, useMemo } from 'react';

import 'highlight.js/styles/atom-one-dark.css';
import './index.less';

interface Params {
  ext: string;
  data: string;
}

const Code: React.FC<Params> = ({ ext, data }) => {
  const className = useMemo(() => {
    switch (ext) {
      case EXT.HTML:
      case EXT.CSS:
      case EXT.LESS:
      case EXT.JS:
      case EXT.TS:
      case EXT.TSX:
      case EXT.JSON:
      case EXT.MD:
        return `language-${ext}`;
      case EXT.ESLINT:
        return `language-json`;
      case EXT.VUE:
        return `language-html`;
      default:
        return 'language-plaintext';
    }
  }, [ext]);

  useLayoutEffect(() => {
    hljs.highlightAll();
  }, [ext]);

  return (
    <pre className='atat-code'>
      <code className={className}>
        {data}
      </code>
    </pre>
  );
};

export default Code;
