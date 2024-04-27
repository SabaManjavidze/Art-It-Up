import type { ReactNode } from "react";
import React, { Fragment, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { twMerge } from "tailwind-merge";
import { MODAL_SESS } from "@/utils/general/constants";

interface ModalPropType {
  children: ReactNode;
  title?: string | ReactNode;
  isOpen: boolean;
  closeModal: () => void;
  className?: string;
}
export default function Modal({
  closeModal,
  isOpen,
  children,
  title,
  className = "",
}: ModalPropType) {
  useEffect(() => {
    if (isOpen) {
      sessionStorage.setItem(MODAL_SESS, "true");
    } else {
      sessionStorage.removeItem(MODAL_SESS);
    }
  }, [isOpen]);
  return (
    <Dialog
      open={isOpen}
      modal
      onOpenChange={(open) => {
        if (!open) closeModal();
      }}
    >
      <DialogContent className={twMerge("", className)}>
        {title != undefined ? (
          typeof title == typeof className ? (
            <DialogHeader className="relative w-full">
              <DialogTitle className="text-center">{title}</DialogTitle>
            </DialogHeader>
          ) : typeof title == typeof {} ? (
            (title as ReactNode)
          ) : null
        ) : null}
        {children}
      </DialogContent>
    </Dialog>
  );
}
