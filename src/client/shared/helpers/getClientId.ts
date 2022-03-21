export const getClientId = (req: any): string => {
  return req.headers['x-forwarded-for'] || req.socket.remoteAdress || req.connection.socket || '0.0.0.0';
}