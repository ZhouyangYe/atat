export enum EXT {
  NONE = 'NONE',
  UNKNOWN = 'UNKNOWN',
  JS = 'js',
  TS = 'ts',
  TSX = 'tsx',
  JSON = 'json',
  TXT = 'txt',
  ESLINT = 'eslintrc',
  ESIGNORE = 'eslintignore',
  GITIGNORE = 'gitignore',
  SQL = 'sql',
  MD = 'md',
  HTML = 'html',
  LESS = 'less',
  CSS = 'css',
  MP3 = 'mp3',
  MP4 = 'mp4',
  FBX = 'fbx',
  GIF = 'gif',
  PNG = 'png',
  JPG = 'jpg',
  JPEG = 'jpeg',
  BMP = 'bmp',
  SVG = 'svg',
  ICO = 'ico',
}

export const getExt = (filename: string): EXT => {
  const units = filename.split('.');

  if (units.length === 1) {
    return EXT.NONE;
  }

  const ext = units.pop()!;

  if (Object.values(EXT).includes(ext.toLowerCase() as EXT)) {
    return ext as EXT;
  }

  return EXT.UNKNOWN;
};
