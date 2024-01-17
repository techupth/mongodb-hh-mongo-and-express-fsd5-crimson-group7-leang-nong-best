export const loggerMiddleware = (req, res, next) => {
  console.log("Incoming request:", {
    method: req.method,
    url: req.url,
    params: req.params,
    query: req.query,
    body: req.body,
    headers: req.headers,
  });

  next();
};
