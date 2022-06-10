const path = require('path');
const fs = require('fs');
const Fontmin = require('fontmin');

const compressFont = (name) => {
  const fontPath = path.resolve(__dirname, `../../resources/static/font/`);

  fs.readFile(path.resolve(fontPath, 'characters.txt'), 'utf-8', (err, data) => {
    if (err) {
      console.error(err, true);
      return;
    }

    console.log(data);

    new Fontmin()
      .src(path.resolve(fontPath, name))
      .use(Fontmin.glyph({
        text: data,
        hinting: false,
      }))
      .use(Fontmin.ttf2eot())
      .use(Fontmin.ttf2woff())
      .dest(path.resolve(fontPath, 'compressed'))
      .run((e) => {
        if (e) {
          console.error(err, true);
          return;
        }
        console.info(`Done: ${path.resolve(fontPath, name)}`, true);
      });
  });
};

module.exports = compressFont;
