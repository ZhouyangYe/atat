import React from 'react';
import { EXT } from 'atat-common/lib/utils';

import './index.less';

interface Params {
  ext: EXT;
  filename: string;
  onclick?: () => void;
}

const iconMap = {
  [EXT.JS]: '@resources/static/icons/js.svg',
  [EXT.TS]: '@resources/static/icons/ts.svg',
  [EXT.TSX]: '@resources/static/icons/react.svg',
  [EXT.JSON]: '@resources/static/icons/json.svg',
  [EXT.TXT]: '@resources/static/icons/txt.svg',
  [EXT.UNKNOWN]: '@resources/static/icons/file.svg',
  [EXT.NONE]: '@resources/static/icons/folder.svg',
  [EXT.ESLINT]: '@resources/static/icons/eslint.svg',
  [EXT.ESIGNORE]: '@resources/static/icons/eslintignore.svg',
  [EXT.GITIGNORE]: '@resources/static/icons/git.svg',
  [EXT.SQL]: '@resources/static/icons/sql.svg',
  [EXT.MD]: '@resources/static/icons/markdown.svg',
  [EXT.HTML]: '@resources/static/icons/html.svg',
  [EXT.CSS]: '@resources/static/icons/css.svg',
  [EXT.LESS]: '@resources/static/icons/less.svg',
  [EXT.MP3]: '@resources/static/icons/audio.svg',
  [EXT.MP4]: '@resources/static/icons/video.svg',
  [EXT.FBX]: '@resources/static/icons/model.svg',
  [EXT.GIF]: '@resources/static/icons/gif.svg',
  [EXT.JPEG]: '@resources/static/icons/image.svg',
  [EXT.JPG]: '@resources/static/icons/image.svg',
  [EXT.PNG]: '@resources/static/icons/image.svg',
  [EXT.BMP]: '@resources/static/icons/image.svg',
  [EXT.SVG]: '@resources/static/icons/image.svg',
  [EXT.ICO]: '@resources/static/icons/image.svg',
};

const File: React.FC<Params> = ({ ext, filename, onclick }) => {
  return (
    <div onClick={onclick} className={`atat-file`}>
      <img src={iconMap[ext]} />
      <span className='filename'>{filename}</span>
    </div>
  );
};

export default File;
