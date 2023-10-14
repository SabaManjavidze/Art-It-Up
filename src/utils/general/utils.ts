import { UserAddress } from "@prisma/client";

export const Capitalize = (s: string) => {
  return `${s[0]?.toUpperCase()}${s.slice(1, s.length)}`;
};

export const limitTxt = (str: string, limit: number) => {
  return str.length > limit ? `${str.slice(0, limit)}...` : str;
};
export const formatAddress = (details: UserAddress) => {
  const { selected, userId, ...realDetails } = details;
  let str = "";
  Object.entries(realDetails).forEach(([key, value]) => {
    const realValue = value ?? "";
    if (str.length == 0) {
      str += `${key}=${realValue}`;
    } else {
      str += `&${key}=${realValue}`;
    }
  });
  return str;
};
