export const getClientIp = (req: any): string => {
  return (
    req.headers['x-forwarded-for'] ||
    req.socket.remoteAddress ||
    req.connection.socket ||
    '0.0.0.0'
  );
};
