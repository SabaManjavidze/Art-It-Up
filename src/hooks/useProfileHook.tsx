import type { Dispatch, ReactNode, SetStateAction } from "react";
import React, { createContext, useContext, useEffect, useState } from "react";
import type { SearchType } from "@/components/ui/SearchTypeDropDown";

type ProfileContextProps = {
  changes: number;
  setChanges: React.Dispatch<SetStateAction<number>>;
};
export const ProfileContext = createContext<ProfileContextProps>({
  changes: 0,
  setChanges: () => {},
});
export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [changes, setChanges] = useState(0);

  return (
    <ProfileContext.Provider
      value={{
        changes,
        setChanges,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
