export const getClientId = (req: any): string => {
  return req.headers['x-forwarded-for'] || req.socket.remoteAdress;
};
