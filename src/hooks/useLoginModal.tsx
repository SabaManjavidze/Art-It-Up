import type { Dispatch, ReactNode, SetStateAction } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import type { SearchType } from "@/components/ui/SearchTypeDropDown";
import LoginModal from "@/components/general/LoginModal";
import WhitelistModal from "@/components/homePageComponents/WhitelistModal";

type ModalContextProps = {
  listModal: boolean;
  setListModal: Dispatch<boolean>;
  loginModal: boolean;
  setLoginModal: Dispatch<boolean>;
};
export const ModalContext = createContext<ModalContextProps>({
  listModal: false,
  setListModal: () => {},
  loginModal: false,
  setLoginModal: () => {},
});
export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [loginModal, setLoginModal] = useState(false);
  const [listModal, setListModal] = useState(false);

  return (
    <ModalContext.Provider
      value={{
        loginModal,
        setLoginModal,
        listModal,
        setListModal,
      }}
    >
      <LoginModal
        modalOpen={loginModal}
        closeModal={() => setLoginModal(false)}
      />
      <WhitelistModal
        modalOpen={listModal}
        closeModal={() => setListModal(false)}
      />
      {children}
    </ModalContext.Provider>
  );
};
