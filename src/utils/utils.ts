export const Capitalize = (s: string) => {
  return `${s[0]?.toUpperCase()}${s.slice(1, s.length)}`;
};

export const limitTxt = (str: string, limit: number) => {
  return str.length > limit ? `${str.slice(0, limit)}...` : str;
};
