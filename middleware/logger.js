module.exports = function logger(req, res, next) {
  const start = Date.now();
  const { method, originalUrl } = req;

  const originalEnd = res.end;
  res.end = function (...args) {
    const duration = Date.now() - start;
    if (!res.headersSent) {
      res.setHeader('X-Response-Time', `${duration}ms`);
    }
    return originalEnd.apply(this, args);
  };

  res.on('finish', () => {
    const duration = Date.now() - start;
    const time = new Date().toISOString();
    console.log(`[${time}] ${method} ${originalUrl} ${res.statusCode} - ${duration}ms`);
  });

  next();
};
