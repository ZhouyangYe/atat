module.exports = (req) => {
  return new Promise((resolve) => {
    req.setEncoding('utf8');
    let body = '';

    req.on('data', data => {
      body += data;
    });

    req.on('end', () => {
      body = JSON.parse(body);
      resolve(body);
    });
  });
};
