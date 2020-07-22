export const getFullUrl = (path: string): string => {
  const { protocol, host } = location;
  return `${protocol}//${host}${path}`;
};
