export enum Authority {
  ROOT,
  ADMIN,
  IT_SUPPORT,
  DATA_SUPPORT,
  CLIENT_SUPPORT,
  MODERATOR,
}

export const getEnumName = (authority: Authority) => {
  if(authority === Authority.ROOT) return 'ROOT';
  if(authority === Authority.ADMIN) return 'ADMIN';
  if(authority === Authority.IT_SUPPORT) return 'IT_SUPPORT';
  if(authority === Authority.DATA_SUPPORT) return 'DATA_SUPPORT';
  if(authority === Authority.CLIENT_SUPPORT) return 'CLIENT_SUPPORT';
  if(authority === Authority.MODERATOR) return 'MODERATOR';
}